var format="png"
    $("#format").change(function(){
        format = $(this).children("option:selected").val();
    });
    var files
      $('#form').on('submit', function (e){
        e.preventDefault()
    //$('#upload-input').click();
    $("#button").text("Uploading File")
    $("#button").prop("disabled","true")
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    convertFile()
});
$('#upload-input').on('change', function(){
  files = $(this).get(0).files;
  var fileExtension = ['png', 'jpg', 'jpeg', 'gif', 'tiff','bmp','wmf'];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
           $(this).val("") 
    
swal ( "Oops" ,"Please Upload a Image File",  "error" )

        }
})

function convertFile(){
  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();
    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      // add the files to formData object for the data payload
      formData.append('file', file, file.name);
    }
    console.log(formData)
    var formdata2 = new FormData()
    $.ajax({
      url: '/uploadimageconverter',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          var data2 = {path:data.path,format:format}
          console.log('upload successful!\n' + data.path);
          $("#button").text("File Uploaded Now Processing")
          $("#button").prop("disabled",true);
          formdata2.append('path',data.path)
          $.ajax({
              url:'/imageconverter',
              type:'POST',
              data:JSON.stringify(data2),
              contentType: "application/json",
              dataType:"json",
      success:function(data){

        console.log(data)

        console.log(data)


        window.location.href = '/download?path=' + data.path; // Replaced window.open
          $("#button").text("Download Image File");
$("#upload-input").val(''); // Clear the input field
  $('.progress-bar').text('0%'); // Reset progress bar text
  $('.progress-bar').width('0%'); // Reset progress bar width
$("#button").prop("disabled", false);
      }
          })
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();
        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');
            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }
          }
        }, false);
        return xhr;
      }
    });
  }
}