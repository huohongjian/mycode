<?php 
include_once("__init.php");


function getRow() {
    $stru = new Structure();
    return $stru->getRow($_REQUEST['struid']);
}

function saveRows() {
    $stru = new Structure();
    $stru->taskid = $_REQUEST['taskid'];
    
    $ids = array();
    $rows = json_decode($_REQUEST['rows']);
    foreach ($rows as $r) {
        $stru->struid   = $r[0];
        $stru->label    = $r[1];
        $stru->name     = $r[2];
        $stru->unit     = $r[3];
        $stru->rfloat   = $r[4]=='true' ? 'true' : 'false';
        $stru->cfloat   = $r[5]=='true' ? 'true' : 'false';
        $stru->deleted  = $r[6]=='true' ? 'true' : 'false';
        if ($stru->struid == '') {
            $ids[] = $stru->add();
        } else {
            $ids[] = $stru->update();
        }
    }
   
    $r = array();
    $r['ids'] = $ids;
    $r['msg'] = '报表保存成功!';
    return $r;
}

function getTableList() {
    $stru = new Structure();
    return $stru->getTableList($_REQUEST['taskid']);
}

function getNames(){
    $stru=new Structure();
    return $stru->getNames($_REQUEST['taskid']);
}

function getByTaskid() {
    $stru = new Structure();
    return $stru->getByTaskid($_REQUEST['taskid']);
}

function getCHeaders() {
    $stru = new Structure();
    $res = $stru->getRow($_REQUEST['struid']);
    return $res['cheaders'];
}

function getRHeaders(){
    $stru = new Structure();
    $res = $stru->getRow($_REQUEST['struid']);
    $r['rheaders']  = $res['rheaders'];
    $r['widths']    = $res['widths'];
    return $r;
}


function getColumns(){
    $stru = new Structure();
    $res = $stru->getRow($_REQUEST['struid']);
    $r['columns']   = $res['columns'];
    $r['widths']    = $res['widths'];
    return $r;
}

function saveCHeaders() {
    $stru = new Structure();
    $stru->updateCHeaders($_REQUEST['struid'], $_REQUEST['cheaders']);
    $array['msg'] = '横表头保存成功 !';
    return $array;
}

function saveRHeaders() {
    $stru = new Structure();
    $stru->updateRHeaders($_REQUEST['struid'], $_REQUEST['rheaders']);
    $array['msg'] = '纵表头保存成功 !';
    return $array;
}

function saveStyle(){
    $stru = new Structure();
    $stru->updateStyle($_REQUEST['struid'], $_REQUEST['style']);
    $array['msg'] = '样式表保存成功 !';
    return $array;
}


    
    
?>