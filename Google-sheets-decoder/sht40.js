function Decoder(bytes, port) {
    var decoded = {};

    function transformers(bytes) {
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

    // TODO: Transform bytes to decoded payload below
    var decodedPayload = {
        "humidity": decoded.humi,
        "temperature": decoded.temp
    };
    // END TODO

    return Serialize(decodedPayload)
}
  
// Generated: do not touch unless your Google Form fields have changed
var field_mapping = {
"humidity": "entry.1872099243",
"temperature": "entry.2123466033"
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
    
