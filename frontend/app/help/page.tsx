import Image from "next/image";
import Link from "next/link";

export default function HelpPage() {
  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundImage: "url('/images/welcome-bg.png')", backgroundSize: "cover", backgroundPosition: "bottom center" }}
    >
      <div className="container mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div className="relative">
            <span className="watermark">Help</span>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-white">HELP</h2>
              <h3 className="text-white/80 mt-1">Pakistan Sign Language</h3>
            </div>
          </div>
          <Link href="/">
            <Image src="/images/back.png" alt="Back" width={75} height={75} className="cursor-pointer hover:opacity-80" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-10 items-start mt-10">
          {/* Text */}
          <div className="max-w-md">
            <p className="text-white/70 leading-relaxed text-base">
              Communication is a primary human need and language is the medium for this.
              Most people have the ability to listen and speak and they use different languages to communicate.
              Hearing-impaired people use signs to communicate with other people.
              Pakistan Sign Language (PSL) is the preferred language of deaf people.
              In order to make communication between deaf and normal people more simple and easy,
              computer-based PSL interpreters are required.
            </p>
            <p className="text-white/70 leading-relaxed text-base mt-4">
              The aim of the project is to bridge the communication gap between signers and non-signers by
              developing an interpretation system which is cost-effective and easy to use.
            </p>
            <p className="text-white mt-4">
              <strong>Requirements:</strong> A webcam and Python backend running.
            </p>
          </div>

          {/* Signs image */}
          <div className="flex-1 flex justify-center" style={{ marginTop: -70 }}>
            <Image src="/images/screen.png" alt="PSL Signs" width={600} height={400} className="rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
