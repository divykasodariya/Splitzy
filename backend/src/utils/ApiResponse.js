class ApiResposne {
    constructor(statusCode,message="success",data){
        this.statusCode=statusCode
        this.message=message;
        this.data=data;
        this.sucess=statusCode<400
    }
}
export{ApiResposne};
