<?php 
include_once("__init.php");


function getAll() {
    $task = new Task();
    $r = $task->getAll();
    return $r;
}

function getTaskList() {
    $task = new Task();
    $res = $task->getTaskList();
    return $res;
}


function getInfo() {
    $task = new Task();
    return $task->getInfo($_REQUEST['taskid']);
}

function getTaskName(){
    $task = new Task();
    return $task->getTaskName($_REQUEST['taskid']);
}

function saveTasks() {
    $ids = array();
    $rows = json_decode($_REQUEST['tasks']);
    $task = new Task();
    foreach ($rows as $t) {
        $task->taskid    = $t[0];
        $task->name      = $t[1];
        $task->title     = $t[2];
        $task->taskcatid = $t[3];
        $task->subjectid = $t[4];
        $task->periodid  = $t[5];
        $task->rangeid   = $t[6];
        $task->remark    = $t[7];
        $task->deleted   = $t[8]=='true' ? 'true' : 'false';
        if ($task->taskid == '') {
            $ids[]  = $task->add();
        } else {
            $ids[]  = $task->update();
        }
    }
    $r = array();
    $r['ids'] = $ids;
    $r['msg'] = '任务保存成功!';
    return $r;
}


?>