function Decoder(bytes, port) {
 
    var decoded = {};
    
    function transformers(bytes){
      value = bytes[0] * 256 + bytes[1];
      return value;
    }
    
    if (port == 8) {
      decoded.voc = transformers(bytes.slice(0,2));
      decoded.eco2 = transformers(bytes.slice(2,4));
    }
   
    return decoded;
  }