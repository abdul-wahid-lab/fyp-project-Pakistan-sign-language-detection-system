class PslLetter {
  final String urdu;
  final String name;
  final String urduName;
  const PslLetter(this.urdu, this.name, this.urduName);
}

class PslWord {
  final String urdu;
  final String english;
  final String transliteration;
  const PslWord(this.urdu, this.english, this.transliteration);
}

const pslAlphabet = [
  PslLetter('ء', 'Hamza',       'ہمزہ'),
  PslLetter('ا', 'Alif',        'الف'),
  PslLetter('ب', 'Be',          'بے'),
  PslLetter('پ', 'Pe',          'پے'),
  PslLetter('ت', 'Te',          'تے'),
  PslLetter('ٹ', 'Ṭe',          'ٹے'),
  PslLetter('ث', 'Se',          'ثے'),
  PslLetter('ج', 'Jeem',        'جیم'),
  PslLetter('چ', 'Che',         'چے'),
  PslLetter('ح', 'Baṛī He',     'بڑی حے'),
  PslLetter('خ', 'Khe',         'خے'),
  PslLetter('د', 'Dal',         'دال'),
  PslLetter('ڈ', 'Ḍal',         'ڈال'),
  PslLetter('ذ', 'Zal',         'ذال'),
  PslLetter('ر', 'Re',          'رے'),
  PslLetter('ز', 'Ze',          'زے'),
  PslLetter('ژ', 'Zhe',         'ژے'),
  PslLetter('س', 'Seen',        'سین'),
  PslLetter('ش', 'Sheen',       'شین'),
  PslLetter('ص', 'Suad',        'صواد'),
  PslLetter('ض', 'Zuad',        'ضواد'),
  PslLetter('ط', 'Toe',         'طوے'),
  PslLetter('ظ', 'Zoe',         'ظوے'),
  PslLetter('ع', 'Ain',         'عین'),
  PslLetter('غ', 'Ghain',       'غین'),
  PslLetter('ف', 'Fe',          'فے'),
  PslLetter('ق', 'Qaf',         'قاف'),
  PslLetter('ک', 'Kaf',         'کاف'),
  PslLetter('گ', 'Gaf',         'گاف'),
  PslLetter('ل', 'Lam',         'لام'),
  PslLetter('م', 'Meem',        'میم'),
  PslLetter('ن', 'Noon',        'نون'),
  PslLetter('ں', 'Noon Ghunna', 'نون غنہ'),
  PslLetter('و', 'Wao',         'واؤ'),
  PslLetter('ھ', 'Choṭī He',    'چھوٹی ہے'),
  PslLetter('ی', 'Ye',          'یے'),
  PslLetter('ے', 'Baṛī Ye',     'بڑی یے'),
];

const pslWords = [
  PslWord('السلام علیکم', 'Hello',   'As-salaam alaikum'),
  PslWord('اللہ حافظ',    'Goodbye', 'Allah hafiz'),
  PslWord('باپ',           'Father',  'Baap'),
  PslWord('ماں',           'Mother',  "Maa'n"),
  PslWord('میں',           'I / Me',  'Mein'),
];

// MediaPipe hand skeleton connections for overlay drawing
const handConnections = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
];
