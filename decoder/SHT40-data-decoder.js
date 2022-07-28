function Decoder(bytes, port) {
 
    var decoded = {};
    
    function transformers(bytes){
      value = bytes[0] * 256 + bytes[1];
      if (value >= 32768) {
        value = 32768 - value;
      }
      value = value/100.0;
      return value;
    }

    if (port == 8) {
        decoded.temp = transformers(bytes.slice(0, 2));
        decoded.humi = transformers(bytes.slice(2, 4));
    }
   
    return decoded;
  }