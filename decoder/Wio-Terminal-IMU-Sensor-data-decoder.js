function Decoder(bytes, port) {
 
    var decoded = {};
    
    function transformers(bytes){
      if (bytes[0] == 255 || bytes[0] == 0) {
        value = bytes[2] * 256 + bytes[3];
        if (value >= 32768) {
          value = value - 65536;
        }
        value = value/100.0;
      }
      return value;
    }
    
    if (port == 8) {
      decoded.x = transformers(bytes.slice(0,4));
      decoded.y = transformers(bytes.slice(4,8));
      decoded.z = transformers(bytes.slice(8,12));
    }
   
    return decoded;
  }