//src:
//[1] https://stackoverflow.com/a/37403125/1757149
//[2] https://stackoverflow.com/a/2117523/1757149

var socket = io.connect();
var isInFrame = { //[1] //bool // is face in frame?
    aInternal: Centered,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}
var isFacingCamera = { //[1] //bool
    aInternal: Centered,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}
var isGettingFaces = { //[1] //bool //are faces being captured and sent to server
    aInternal: false,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}
var isUserAccessing = { //[1] //bool //is user currently GETting and POSTing?
    aInternal: false,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}
var isSmiling = { //[1] //bool
    aInternal: Smiled,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}
var areEyesClosed = { //[1] //bool
    aInternal: Blinked,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}
var isMouthOpen = { //[1] //bool
    aInternal: Yawned,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}
var face = {
    id: uuidv4(),
    feature: "face",
    url: "undefined"
}
var setSessionOnce = false;

window.addEventListener('load', init);

function init() {
    console.log("client.js loaded.");
    //when face is in frame and facing camera, let things happen
    isInFrame.registerListener(function(val) {
        if (isFacingCamera.a) {
            socket.emit('isGettingFaces', val); //post isInFrame bool
            console.log("isGettingFaces");
            //TODO add image info to face object
            socket.emit('newFace', face); //post image obj
        } //end if(isFacingCamera)
    });

    //when user is smiling and eyes are closed, begin or end session
    isSmiling.registerListener(function(val) {
        if (isInFrame && isFacingCamera) {
            if (areEyesClosed.a) {
                if (!setSessionOnce) {
                    if (isUserAccessing) {
                        isUserAccessing = false;
                    } else {
                        isUserAccessing = true; //don't need to send this to server
                    }
                    setSessionOnce = true;
                }
            } else { //end if(areEyesClosed)
                setSessionOnce = false;

                //get last face when smiling and in session
                if (isInFrame && isFacingCamera) {
                    if (isUserAccessing) {
                        socket.emit('getLastFace', 0);
                    }
                }
            }
        }
    });

    //delete last face when yawning and in session
    isMouthOpen.registerListener(function(val) {
        if (isInFrame && isFacingCamera) {
            if (isUserAccessing) {
                socket.emit('deleteLastFace', 0);
            }
        }
    });
}

function uuidv4() { //[2] //generates UID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}