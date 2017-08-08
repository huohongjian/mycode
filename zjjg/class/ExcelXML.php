<?php

/**
 * Simple excel generating from PHP5
 * 
 * This is one of my utility-classes.
 * 
 * The MIT License
 * 
 * Copyright (c) 2007 Oliver Schwarz
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * @package Utilities
 * @author Oliver Schwarz <oliver.schwarz@gmail.com>
 * @version 1.0
 */

/**
 * Generating excel documents on-the-fly from PHP5
 * 
 * Uses the excel XML-specification to generate a native
 * XML document, readable/processable by excel.
 * 
 * @package Utilities
 * @subpackage Excel
 * @author Oliver Schwarz <oliver.schwarz@vaicon.de>
 * @version 1.0
 *
  * @todo Add error handling (array corruption etc.)
 * @todo Write a wrapper method to do everything on-the-fly
 */
class ExcelXML {
    private $header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?\>	
<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"
 xmlns:x=\"urn:schemas-microsoft-com:office:excel\"
 xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"
 xmlns:html=\"http://www.w3.org/TR/REC-html40\">";
    private $footer = "</Workbook>";
    private $lines = array ();
    private $worksheet_title = "Table1";
    private $seqence = 0;
    
    public $headers = array();
    public $addSeqence = false;
    
    private function addRow ($array) {
        $cells = "";
        if ($this->addSeqence) {
        	$this->seqence++;
            $cells .= "<Cell><Data ss:Type=\"Number\">$this->seqence</Data></Cell>\n"; 
        }
        foreach ($array as $k => $v):
            $cells .= "<Cell><Data ss:Type=\"String\">$v</Data></Cell>\n";
        endforeach;
        $this->lines[] = "<Row>\n" . $cells . "</Row>\n";
    }

    public function addArray ($array) {
    	$cells = "";
    	if($this->headers){
    		foreach ($this->headers as $h) {
    			$cells .= "<Cell><Data ss:Type=\"String\">$h</Data></Cell>\n"; 
    		}
    		$this->lines[] = "<Row>\n" . $cells . "</Row>\n";
    	}
    	
    	
    	
        foreach ($array as $k => $v):
            $this->addRow ($v);
        endforeach;
    }

    public function setWorksheetTitle ($title) {
        $title = preg_replace ("/[\\\|:|\/|\?|\*|\[|\]]/", "", $title);
        $title = substr ($title, 0, 31);
        $this->worksheet_title = $title;
    }

    function generateXML ($filename) {
        header("Content-Type: application/vnd.ms-excel; encoding=UTF-8");
        header("Content-Disposition: inline; filename=\"$filename.xls\"");

        // print out document to the browser
        // need to use stripslashes for the damn ">"
        echo stripslashes ($this->header);
        echo "\n<Worksheet ss:Name=\"" . $this->worksheet_title . "\">\n<Table>\n";
 //       echo "<Column ss:Index=\"1\" ss:AutoFitWidth=\"0\" ss:Width=\"110\"/>\n";
        echo implode ("\n", $this->lines);
        echo "</Table>\n</Worksheet>\n";
        echo $this->footer;
        

    }

}



/* For Example
require (dirname (__FILE__) . "/class-excel-xml.inc.php");
$doc = array (
   1=> array ("Oliver", "Peter", "Paul"),
       array ("Marlene", "Lucy", "Lina")
    );
$xls = new ExcelXML;
$xls->addArray ( $doc );
$xls->generateXML ("mytest");
*/
?>