import {
    API_URL,
    GET_DATA_ENDPOINT,
    SEND_DATA_ENDPOINT,
    MONEYPOT
  } from './auth.constants';
  
  import request from './api.request';
  
  class DataService {
    constructor() {
      this.getData = this.getData.bind(this);
      this.sendData = this.sendData.bind(this);
    }
  
    async getData(params) {

      try {
        const response = await request({
          url: API_URL + MONEYPOT,
          method: 'GET',
          data: params.data,
          headers: params.headers
        });
  
        if (response) {
          return response;
        }
      } catch (error) {
        return error.response;
      }
    }

    async sendData(params) {
        console.log(params.data);
        try {
          const response = await request({
            url: API_URL + MONEYPOT,
            method: 'POST',
            data: { 'message': params.data },
            
            headers: {
              ...params.headers,
            }
          });
          
          if (response) {
            return response;
          }
        } catch (error) {
          return error.response;
        }
    }
  
    
  }
  
  export default new DataService();
