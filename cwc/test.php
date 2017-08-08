<?php
	function __autoload ( $class ) {
	    include_once ( "class/$class.php" );
	}

    
    
    $session = new Session();
    $session->write('{"id":1, "name":"a\"aa"}');
    
    var_dump( $session->read('name'));
    
    
    
    
    
    
?>
