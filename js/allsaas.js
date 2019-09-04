
          var ac;

        $.ajax({
          "async": false,
          "crossDomain": true,
          "url": "https://www.yuque.com/api/v2/repos/keeplearning/cv3026/docs/tp6ili",
          "method": "GET",
          "headers": {
            "X-Auth-Token": "rvf7keaUUCdPDlQxcl5iVUPckWYssVGKYQeYMHka",
            "Content-Type": "application/json",
          },
           "data": {
             "raw":1
           },
               success: function (json) {
                   ac = json;
                   console.log(ac);
               }
           });
console.log(ac);
