function Decoder(bytes, port) {
    var decoded = {};
    
    function transformers(bytes){
      value = bytes[0] * 256 + bytes[1];
      return value;
    }
    
    if (port == 8) {
      decoded.model = transformers(bytes.slice(0,2));
      decoded.confidence = transformers(bytes.slice(2,4));
    }

    // TODO: Transform bytes to decoded payload below
    var decodedPayload = {
      "human-num": decoded.model,
      "human-confidence": decoded.confidence
    };
    // END TODO
  
    return Serialize(decodedPayload)
  }
  
// Generated: do not touch unless your Google Form fields have changed
var field_mapping = {
"human-num": "entry.1391174757",
"human-confidence": "entry.734213207"
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
    