package com.linguasign.app

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageFormat
import android.graphics.Matrix
import android.graphics.Rect
import android.graphics.YuvImage
import android.util.Log
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.Delegate
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import java.io.ByteArrayOutputStream

class MainActivity : FlutterActivity() {

    private val CHANNEL = "linguasign/mediapipe"
    private var handLandmarker: HandLandmarker? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        initHandLandmarker()

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "detectHand" -> {
                        try {
                            val bytes    = call.argument<ByteArray>("bytes")!!
                            val width    = call.argument<Int>("width")!!
                            val height   = call.argument<Int>("height")!!
                            val rotation = call.argument<Int>("rotation") ?: 0
                            result.success(detectHand(bytes, width, height, rotation))
                        } catch (e: Exception) {
                            Log.e("LinguaSign", "detectHand exception: ${e.message}", e)
                            result.error("DETECT_FAILED", e.message, null)
                        }
                    }
                    else -> result.notImplemented()
                }
            }
    }

    private fun initHandLandmarker() {
        try {
            val baseOptions = BaseOptions.builder()
                .setModelAssetPath("flutter_assets/assets/models/hand_landmarker.task")
                .setDelegate(Delegate.CPU)
                .build()
            val options = HandLandmarker.HandLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setRunningMode(RunningMode.IMAGE)
                .setNumHands(1)
                .setMinHandDetectionConfidence(0.3f)
                .setMinHandPresenceConfidence(0.3f)
                .setMinTrackingConfidence(0.3f)
                .build()
            handLandmarker = HandLandmarker.createFromOptions(this, options)
            Log.i("LinguaSign", "HandLandmarker initialised OK")
        } catch (e: Exception) {
            Log.e("LinguaSign", "HandLandmarker init FAILED: ${e.message}", e)
        }
    }

    private fun detectHand(bytes: ByteArray, width: Int, height: Int, rotation: Int): List<Double>? {
        val landmarker = handLandmarker ?: run {
            Log.w("LinguaSign", "handLandmarker is null, skipping")
            return null
        }

        // NV21 → JPEG → Bitmap (landscape, sensor-native orientation)
        val yuv = YuvImage(bytes, ImageFormat.NV21, width, height, null)
        val out = ByteArrayOutputStream()
        yuv.compressToJpeg(Rect(0, 0, width, height), 85, out)
        var bitmap: Bitmap = BitmapFactory.decodeByteArray(out.toByteArray(), 0, out.size()) ?: run {
            Log.w("LinguaSign", "bitmap decode returned null (w=$width h=$height bytes=${bytes.size})")
            return null
        }

        // Physically rotate so MediaPipe sees an upright portrait image.
        // This is critical: landmarks returned by MediaPipe will then be in
        // portrait coordinate space, matching the classifier's training data.
        if (rotation != 0) {
            val matrix = Matrix()
            matrix.postRotate(rotation.toFloat())
            bitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        }

        val detectionResult = landmarker.detect(BitmapImageBuilder(bitmap).build())
        Log.d("LinguaSign", "hands=${detectionResult.handednesses().size} bmp=${bitmap.width}x${bitmap.height} rot=$rotation")
        if (detectionResult.handednesses().isEmpty()) return null

        // Prefer the hand MediaPipe calls "right" — on a front camera the
        // selfie-mirror may swap labels, so fall back to index 0 if not found.
        val handIndex = detectionResult.handednesses()
            .indexOfFirst { it.firstOrNull()?.categoryName()?.lowercase() == "right" }
            .takeIf { it >= 0 } ?: 0

        val result = mutableListOf<Double>()
        for (lm in detectionResult.landmarks()[handIndex]) {
            result.add(lm.x().toDouble())
            result.add(lm.y().toDouble())
        }
        return result  // 42 normalised doubles [x0,y0…x20,y20] in portrait space
    }
}
