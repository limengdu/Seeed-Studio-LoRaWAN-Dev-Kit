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

    // TODO: Transform bytes to decoded payload below
    var decodedPayload = {
      "x": decoded.x,
      "y": decoded.y,
      "z": decoded.z
    };
    // END TODO
  
    return Serialize(decodedPayload)
  }
  
  // Generated: do not touch unless your Google Form fields have changed
  var field_mapping = {
    "x": "entry.1597691235",
    "y": "entry.1934522609",
    "z": "entry.836531240"
  };
  // End Generated
  
  function Serialize(payload) {
    var str = [];
    for (var key in payload) {
      if (payload.hasOwnProperty(key)) {
        var name = encodeURIComponent(field_mapping[key]);
        var value = encodeURIComponent(payload[key]);
        str.push(name + "=" + value);
      }
    }
    return str.join("&");
  }
  // DO NOT REMOVE: Google Form Function
    