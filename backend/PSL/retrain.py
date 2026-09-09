import PSL.helper.db_helper as dbh
import PSL.helper.synthesize_data as synth
import PSL.alphabet_recognition.train_alphabet_model as alphabet_model
import PSL.word_recognition.train_word_model as word_model


def re_train(mode):
    if mode == 0:
        dbh.create_table()
        dbh.populate_db()
        synth.synthesize(20)
        alphabet_model.train_alphabets()

    if mode == 1:
        dbh.create_pose_table()
        dbh.populate_words()
        word_model.train_words()
