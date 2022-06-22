function Decoder(bytes, port) {
 
    var decoded = {};
    
    function transformers(bytes){
      if (bytes[0] == 255 || bytes[0] == 0) {
        value = bytes[2] * 256 + bytes[3];
        value = value/100.0;
      }
      return value;
    }
    
    if (port == 8) {
      decoded.temp = transformers(bytes.slice(0,4));
      decoded.humi = transformers(bytes.slice(4,8));
    }
   
    return decoded;
  }