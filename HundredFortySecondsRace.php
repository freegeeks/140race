<?php

$game = new HundredFortySecondsRace(array('#CuandoHaceFrioYo', '#OkuluSevmemeNedenim')); //hashtags
$game->login('MsrAEqq42Bom767QusO4318PL', 'C3odEyJEEF4UrLFnoj44wtR8f0kWOjpyUS9Ytmp4wxF0RLs3Qw', '124289477-qNZe9IBb23YNOoL7r5bERIBkM0nV4d4jSr84dDzI', '7JnyD1Y1skRmdFJuH24LzywM2GJhjwsxsjp5TtZK1Hwd1');
$game->start();

class Player {

  private $hash;
  private $points;

  public function __construct($hash) {
    $this->hash = $hash;
  }
  
  public function setPoints($points) {
    $this->points = $points;
  }
  
  public function getPoints() {
    return $this->points;
  }
  
  public function getHash() {
    return $this->hash;
  }
    
};

class HundredFortySecondsRace {
  
  private $scoring = Array(
    "characters"    => 1,
    "retweet"       => 10,
    "favorite"      => 20,
    "hashtag"       => 4,
    "symbols"       => 2,
    "urls"          => 3,
    "user_mentions" => 5,    
    "media"         => 8
  );

  private $dieAfter = 50;
  
  private $player1;
  private $player2;
  
  private $_hashes;
  
  private $m_oauth_consumer_key;
  private $m_oauth_consumer_secret;
  private $m_oauth_token;
  private $m_oauth_token_secret;

  private $m_oauth_nonce;
  private $m_oauth_signature;
  private $m_oauth_signature_method = 'HMAC-SHA1';
  private $m_oauth_timestamp;
  private $m_oauth_version = '1.0';

  public function __construct($hashes) {
    //
    // set a time limit to unlimited
    //
    set_time_limit(0);

    if(count($hashes) != 2)
      die("We need 2 hashes!");

    $this->_hashes = $hashes;
    $this->player1 = new Player($hashes[0]);
    $this->player2 = new Player($hashes[1]);
  }

  //
  // set the login details
  //
  public function login($_consumer_key, $_consumer_secret, $_token, $_token_secret) {
    $this->m_oauth_consumer_key = $_consumer_key;
    $this->m_oauth_consumer_secret = $_consumer_secret;
    $this->m_oauth_token = $_token;
    $this->m_oauth_token_secret = $_token_secret;

    //
    // generate a nonce; we're just using a random md5() hash here.
    //
    $this->m_oauth_nonce = md5(mt_rand());

    return true;
  }

  //
  // process a tweet object from the stream
  //
  private function process_tweet(array $_data) {
    
    $player = null;

    foreach($_data["entities"]["hashtags"] as $hash){
      if($hash["text"] == str_replace("#", "", $this->player1->getHash())){
        $player = $this->player1;
        break;
      }
      if($hash["text"] == str_replace("#", "", $this->player2->getHash())){
        $player = $this->player2;
        break;
      }
    }

    $player->setPoints($player->getPoints() + (strlen($_data["text"]) * $this->scoring["characters"]));

    if(!is_null($_data["coordinates"]))
      $player->setPoints($player->getPoints() + $this->scoring["coordinates"]);

    //retweets
    $player->setPoints($player->getPoints() + ($_data["retweet_count"] * $this->scoring["retweet"]));

    //favorites
    $player->setPoints($player->getPoints() + ($_data["favorite_count"] * $this->scoring["favorite"]));

    //hashtags
    $player->setPoints($player->getPoints() + (count($_data["entities"]["hashtags"]) * $this->scoring["hashtag"]));

    //symbols
    $player->setPoints($player->getPoints() + (count($_data["entities"]["symbols"]) * $this->scoring["symbols"]));

    //urls
    $player->setPoints($player->getPoints() + (count($_data["entities"]["urls"]) * $this->scoring["urls"]));

    //user_mentions
    $player->setPoints($player->getPoints() + (count($_data["entities"]["user_mentions"]) * $this->scoring["user_mentions"]));

    //user_mentions
    if(isset($_data["entities"]["media"]))
      $player->setPoints($player->getPoints() + (count($_data["entities"]["media"]) * $this->scoring["media"]));

    echo "\nhash: ".$player->getHash()." (".$player->getPoints().")";

    //if($_data["coordinates"])
    //$player->setPoints( $player->getPoints() + strlen($_data["text"]));
    
    /*
    $_data["text"]
    $_data["coordinates"]
    $_data["retweet_count"]
    $_data["favorite_count"]
    $_data["entities"]
    */
    
    $this->dieAfter--;

    if($this->dieAfter <= 0)
      die("\nGAME OVER!\n\n".
        $this->player1->getHash().": ".$this->player1->getPoints()."\n".
        $this->player2->getHash().": ".$this->player2->getPoints())."\n\n";

    //return true;
  }

  //
  // the main stream manager
  //
  public function start() {
    while (1) {
      $fp = fsockopen("ssl://stream.twitter.com", 443, $errno, $errstr, 30);
      if (!$fp) {
        echo "ERROR: Twitter Stream Error: failed to open socket";
      } else {
        //
        // build the data and store it so we can get a length
        //
        $data = 'track=' . rawurlencode(implode($this->_hashes, ','));

        //
        // store the current timestamp
        //
        $this->m_oauth_timestamp = time();

        //
        // generate the base string based on all the data
        //
        $base_string = 'POST&' . rawurlencode('https://stream.twitter.com/1.1/statuses/filter.json') . '&' . rawurlencode('oauth_consumer_key=' . $this->m_oauth_consumer_key . '&' . 'oauth_nonce=' . $this->m_oauth_nonce . '&' . 'oauth_signature_method=' . $this->m_oauth_signature_method . '&' . 'oauth_timestamp=' . $this->m_oauth_timestamp . '&' . 'oauth_token=' . $this->m_oauth_token . '&' . 'oauth_version=' . $this->m_oauth_version . '&' . $data);

        //
        // generate the secret key to use to hash
        //
        $secret = rawurlencode($this->m_oauth_consumer_secret) . '&' . rawurlencode($this->m_oauth_token_secret);

        //
        // generate the signature using HMAC-SHA1
        //
        // hash_hmac() requires PHP >= 5.1.2 or PECL hash >= 1.1
        //
        $raw_hash = hash_hmac('sha1', $base_string, $secret, true);

        //
        // base64 then urlencode the raw hash
        //
        $this->m_oauth_signature = rawurlencode(base64_encode($raw_hash));

        //
        // build the OAuth Authorization header
        //
        $oauth = 'OAuth oauth_consumer_key="' . $this->m_oauth_consumer_key . '", ' . 'oauth_nonce="' . $this->m_oauth_nonce . '", ' . 'oauth_signature="' . $this->m_oauth_signature . '", ' . 'oauth_signature_method="' . $this->m_oauth_signature_method . '", ' . 'oauth_timestamp="' . $this->m_oauth_timestamp . '", ' . 'oauth_token="' . $this->m_oauth_token . '", ' . 'oauth_version="' . $this->m_oauth_version . '"';

        //
        // build the request
        //
        $request = "POST /1.1/statuses/filter.json HTTP/1.1\r\n";
        $request .= "Host: stream.twitter.com\r\n";
        $request .= "Authorization: " . $oauth . "\r\n";
        $request .= "Content-Length: " . strlen($data) . "\r\n";
        $request .= "Content-Type: application/x-www-form-urlencoded\r\n\r\n";
        $request .= $data;

        //
        // write the request
        //
        fwrite($fp, $request);

        //
        // set it to non-blocking
        //
        stream_set_blocking($fp, 0);

        while (!feof($fp)) {
          $read = array($fp);
          $write = null;
          $except = null;

          //
          // select, waiting up to 10 minutes for a tweet; if we don't get one, then
          // then reconnect, because it's possible something went wrong.
          //
          $res = stream_select($read, $write, $except, 600, 0);
          if (($res == false) || ($res == 0)) {
            break;
          }

          //
          // read the JSON object from the socket
          //
          $json = fgets($fp);

          //
          // look for a HTTP response code
          //
          if (strncmp($json, 'HTTP/1.1', 8) == 0) {
            $json = trim($json);
            if ($json != 'HTTP/1.1 200 OK') {
              echo 'ERROR: ' . $json . "\n";
              return false;
            }
          }

          //
          // if there is some data, then process it
          //
          if (($json !== false) && (strlen($json) > 0)) {
            //
            // decode the socket to a PHP array
            //
            $data = json_decode($json, true);
            if ($data) {
              //
              // process it
              //
              $this->process_tweet($data);
            }
          }
        }

      }

      fclose($fp);
      sleep(10);
    }

    return;
  }

};
