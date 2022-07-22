function Decoder(bytes, port) {

    var decoded = {};

    if (port == 8) {
      decoded.soil = bytes[0]<<8 | bytes[1];
    }

    // TODO: Transform bytes to decoded payload below
    var decodedPayload = {
      "moisture": decoded.soil
    };
    // END TODO
  
    return Serialize(decodedPayload)
  }
  
  // Generated: do not touch unless your Google Form fields have changed
  var field_mapping = {
    "moisture": "entry.331956528"
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
    