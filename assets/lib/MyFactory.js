let MyFactory = {
    GET: function (url) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method: "GET",
                url,
                success: function (result) {
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    },
    POST: function (url, data){
        return new Promise(function (resolve, reject) {
            $.ajax({
                url,
                method: "POST",
                datatype: "json",
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify(data),
                success: function (result) {
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }
}