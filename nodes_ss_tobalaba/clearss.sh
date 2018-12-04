# only works if script is executed from this file's location
FILEDIR=`dirname "$0"`

rm -rf $FILEDIR/db.tobalaba_ss_alice/secretstore/db
rm -rf $FILEDIR/db.tobalaba_ss_bob/secretstore/db
rm -rf $FILEDIR/db.tobalaba_ss_charlie/secretstore/db