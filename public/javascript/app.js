// var $reqname = $("#reqname");
// var $addreq = $("#addreq");
// var $reqlist = $("#reqlist");

// $(function() {
//     $addreq.on("click", function() {
//         var reqi = {role: $reqname.val()};
        
//         $.ajax({
//             type: "POST",
//             url: "/reqs",
//             data: reqi,
//             success: function() {
//                 $reqlist.append('<li>' + reqi.role + '<li>');
//             },
//             error: function() {
//                 alert("error saving req");
//             }
//         });
//     });
// });

var $canName = $("#canName");
var $canBut = $("#canBut");
var $canTable = $("#canTable");


$(function(){
    $canBut.on("click", function() {
        var can = {name: $canName.val()};
        $.ajax({
            type: "POST",
            url: "/reqs/" + $(this).attr('data-id') + "/candidates",
            data: can,
            datatype: "json",
            success: function(newCan) {
                $canTable.append("<tr><td contenteditable='true'>" + newCan.name + "</td><td><button class='btn btn-xs btn-danger removeCan' data-reqId='" + $canBut.attr('data-id') + "' data-canId='" + newCan._id + "'>X</button></td></tr>");
            },
            error: function() {
                alert("error saving candidate")
            }
        });
    });
    
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
});

