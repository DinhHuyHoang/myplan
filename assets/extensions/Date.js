(function(){

    Date.prototype.addDays = function(days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
    };

    Date.prototype.minusDays = function(days) {
        this.setDate(this.getDate() - parseInt(days));
        return this;
    };

    Date.prototype.toString = function(){
        return this.getFullYear() + '-' + (this.getMonth()+1) + '-' + this.getDate();
    }; 
})();