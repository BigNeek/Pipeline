/* global $*/

var $canName = $("#canName");
var $canBut = $("#canBut");
var $canTable = $("#canTable");
var $check2 = $(".check2");
var $check3 = $(".check3");
var $candidate = $(".candidate");
var $dropdown = $(".dropdown");
var $reqName = $("#reqName");
var $addReq = $("#addReq");
var $reqRow = $(".reqrow");
var $processSelect = $(".processSelect");
var $processCanText = $(".processCanText");
var $processCan = $(".processCan");
var $newCan = $(".newCan");
var $reqRole = $("#reqRole");
var $delReqBut = $(".delReqBut");
var $candidateNote = $(".candidateNote");
var $processPanelBody = $(".processPanelBody");
var $archiveReqBut = $(".archiveReqBut");
var $restoreReqBut = $(".restoreReqBut");


$(function(){
    // ADD NEW REQ CLICK EVENT
    $addReq.click(function() {
        var role = {role: $reqName.val(), user: $(this).attr('data-userid'), archive: "false"};
        $reqName.val("");
        $.ajax({
            type: "POST",
            url: "/reqs",
            data: role,
            success: function(newReq) {
                $reqRow.append("<div class='col-lg-3 col-md-4 col-sm-6 col-xs-12'><a href='/reqs/" + newReq._id + "'><div class='reqDiv'><h4 class='reqP'>" + newReq.role + "</h4><p class='messaged'>Messaged: 0</p><p class='response'>Response rate: 0%</p></div></a>");
            }
        });
    });
    
    // ADD NEW REQ ENTER EVENT
    $reqName.keypress(function(e) {
        if(e.which === 13) {
            $addReq.click();
        }
    });
    
    // ADD NEW CANDIDATE CLICK EVENT
    $canBut.click(function() {
        var can = {name: $canName.val(), requisition: $(this).attr('data-id')};
        $canName.val("");
        $.ajax({
            type: "POST",
            url: "/reqs/" + $(this).attr('data-id') + "/candidates",
            data: can,
            datatype: "json",
            success: function(newCan) {
                // I HAVE TO APPEND THE SELECT TAG IN. MAYBE TIME TO LEARN A TEMPLATING TOOL?
                $canTable.append("<tr><td><p data-reqid='" + $canBut.attr('data-id') + "' data-canid='" + newCan._id + "' contenteditable='true'>" + newCan.name + "</p></td><td><input data-reqid='" + $canBut.attr('data-id') + "' data-canid='" + newCan._id + "' type='checkbox' class='check2'></td><td><input data-reqid='" + $canBut.attr('data-id') + "' data-canid='" + newCan._id + "' type='checkbox' class='check3'></td><td><select data-reqid='" + $canBut.attr('data-id') + "' data-canid='" + newCan._id + "' class='dropdown'><option value=' '>--Select--</option><option value='not interested'>Not Interested</option><option value='in process'>In Process</option></select></td><td><button class='btn btn-xs btn-danger removeCan' data-reqId='" + $canBut.attr('data-id') + "' data-canId='" + newCan._id + "'><i class='fa fa-ban' aria-hidden='true'></i></button></td></tr>");
            },
            error: function() {
                alert("error saving candidate")
            }
        });
    });
    
    // ADD NEW CANDIDATE ENTER EVENT
    $canName.keypress(function(e) {
       if(e.which === 13) {
            $canBut.click();
       }  
    });
    
    // DELETE CANDIDATE
    $canTable.delegate(".removeCan", "click", function() {
        var $tr = $(this).closest("tr");
        
        $.ajax({
            type: "DELETE",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/" + $(this).attr('data-canid'),
            success: function() {
                $tr.remove();
            },
            error: function() {
                console.log("there was an error");
            }
        });
    });
    
    // CHECKMARK EDIT EVENT 1
    $canTable.delegate(".check2", "click", function() {
        if($(this).is(':checked')) {
            var contact2 = true;
        } else {
            var contact2 = false;
        }
        var data = {contact2: contact2}
        $.ajax({
            type: "PUT",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/" + $(this).attr('data-canid'),
            data: data,
            success: function(newCheck) {
            }
        });
    });
    
    // CHECKMARK EDIT EVENT 2
    $canTable.delegate(".check3", "click", function() {
        if($(this).is(':checked')) {
            var contact3 = true;
        } else {
            var contact3 = false;
        }
        var data = {contact3: contact3}
        $.ajax({
            type: "PUT",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/" + $(this).attr('data-canid'),
            data: data,
            success: function(newCheck) {
            }
        });
    });
    
    // CANDIDATE NAME EDIT EVENT
    $canTable.delegate(".candidate", "input", function() {
        var name = {name: $(this).text()}
        $.ajax({
            type: "PUT",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/" + $(this).attr('data-canid'),
            data: name,
            success: function(newName) {
            }
        });
    });
    
    // EDIT REQ NAME
    $reqRole.on("input", function() {
      var name = {role: $(this).text()}
      $.ajax({
          type: "PUT",
          url: "/reqs/" + $(this).attr('data-reqid'),
          data: name,
          success: function(newReq) {
          }
      });
    });
    
    // DELETE REQ
    
    $delReqBut.on("click", function() {
        var answer = confirm("Are you sure you want to delete?");
        if(answer) {
            $.ajax({
                type: "DELETE",
                url: "/reqs/" + $(this).attr('data-reqid'),
                success: function() {
                    window.location.href = "/reqs"
                }
            });
        }
    });
    
    $archiveReqBut.on("click", function() {
        var answer = confirm("Are you sure you want to archive this req?");
        if(answer) {
            $.ajax({
                type: "PUT",
                url: "/reqs/" + $(this).attr('data-reqid'),
                data: {archive: "true"},
                success: function() {
                    window.location.href = "/reqs"
                }
            });
        }
    });
    
    $restoreReqBut.on("click", function() {
        var answer = confirm("Are you sure you want to restore this req?");
        if(answer) {
            $.ajax({
                type: "PUT",
                url: "/reqs/" + $(this).attr("data-reqid"),
                data: {archive: "false"},
                success: function() {
                    window.location.href = "/reqs"
                }
            })
        }
    });
    
    // DROPDOWN EDIT EVENT
    $canTable.delegate(".dropdown", "change", function() {
        var drop = {response: $(this).val()}
        
        $.ajax({
            type: "PUT",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/" + $(this).attr('data-canid'),
            data: drop,
            success: function(newRespose) {
            }
        });
    });
    
    // TURNS TRs GREEN OR RED OR WHITEDEPENDING ON RESPONSE
    $canTable.delegate(".dropdown", "change", function() {
        if($(this).val()==="not interested") {
            $(this).closest("tr").css("background-color", "#f5c0bd");
        } else if($(this).val() === "in process") {
            $(this).closest("tr").css("background-color", "#c6ffc9");
        } else {
            $(this).closest("tr").css("background-color", "white");
        }
    });
    
    
    // ==================== IN PROCESS AJAX CALLS ======================
    
    
    // IN PROCESS DROPDOWN EDIT EVENT
    $processSelect.change(function() {
        var drop = {process: $(this).val()}
        
        $.ajax({
            type: "PUT",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/" + $(this).attr('data-canid'),
            data: drop,
            success: function(updatedProcess) {
                
            }
        });
    });
    
    // CREATE NEW IN PROCESS CANDIDATE
    $processCanText.keypress(function(e) {
       if(e.which === 13) {
        var data = {name: $(this).val(), response: "in process", requisition: $(this).attr('data-reqid')};
        $processCanText.val("");
        var $canTxt = $(this);
        
        $.ajax({
            type: "POST",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/",
            data: data,
            success: function(newCan) {
                $canTxt.prev().append("<li><button type='button' class='btn btn-info btn-xs' data-toggle='modal' data-target='#candidateModall" + newCan._id + "' data-whatever='@mdo'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button><div class='modal fade' id='candidateModall" + newCan._id + "' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' id='exampleModalLabel'>Notes on Candidate</h4></div><div class='modal-body'><form><div class='form-group'><textarea data-reqid='" + $canTxt.attr('data-reqid') + "' data-canid='" + newCan._id + "' class='form-control candidateNote' id='message-text'></textarea></div></form></div></div></div></div><p class='processName newProcessName'>" + newCan.name + "</p><select data-reqid='" + $canTxt.attr('data-reqid') + "'data-canid='" + newCan._id + "'class='processSelect'><option value=''>--- Select ---</option><option value='1'>Waiting on resume/availability</option><option value='2'>Scheduled for Phone screen</option><option value='3'>Waiting on response from Hiring Manager</option><option value='4'>Scheduled to speak with Hiring Manager</option><option value='5'>Waiting on resume/availability for onsite</option><option value='6'>Scheduled for Onsite</option><option value='7'>Extended Offer</option></select></li>");
            }
        });
       }  
    });
    
    // IN PROCESS DROPDOWN EDIT EVENT FOR NEW CANDIDATES
    $newCan.delegate(".processSelect", "change", function() {
        var drop = {process: $(this).val()};
        
        $.ajax({
            type: "PUT",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/" + $(this).attr('data-canid'),
            data: drop,
            success: function(updatedProcess) {
                
            }
        });
    });
    
    // IN PROCESS MODALL EDIT EVENT
    $(".processPanelBody").delegate(".candidateNote", "input", function() {
      
        var data = {note: $(this).val()}
        $.ajax({
            type: "PUT",
            url: "/reqs/" + $(this).attr('data-reqid') + "/candidates/" + $(this).attr('data-canid'),
            data: data,
            success: function(updatedNote) {
            }
        });
    });
});

