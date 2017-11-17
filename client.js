//src:
//[1] https://stackoverflow.com/a/37403125/1757149
//[2] https://stackoverflow.com/a/2117523/1757149
//[3] https://stackoverflow.com/a/6783997/1757149

var socket = io.connect();

var isFacingCamera = {
    val: false,
    doOnce: false
}
var isUserAccessing = {
    val: false,
    doOnce: false
};
var isSmiling = {
    val: false,
    doOnce: false
};
var areEyesClosed = {
    val: false,
    doOnce: false
};
var isMouthOpen = {
    val: false,
    doOnce: false
};
var img = new Image();
img.src = 'assets/brfv4_lion.png';
var face = {
    id: uuidv4(),
    feature: "face",
    url: img.src
}

function faceImage(uvData) {
    console.log("UV data received at clinet:" + uvData);
}

var setSessionOnce = false;

function resetAllVars() {
    isFacingCamera.val = false;
    isFacingCamera.doOnce = false;
    isSmiling.val = false;
    isSmiling.doOnce = false;
    areEyesClosed.val = false;
    areEyesClosed.doOnce = false;
    isMouthOpen.val = false;
    isMouthOpen.doOnce = false;
    console.log("All face states reset.");
}

function changeBool(boolObj, name) {
    if (!boolObj.doOnce) {
        boolObj.val == true;
        if (name == "isFacingCamera") {
            postFace();
        } else if (name == "isSmiling") {
            toggleSession();
        } else if (name == "isMouthOpen") {
            deleteFace();
        }
        boolObj.doOnce = true;
    } else {
        //set boolOnce to false again under a condition that happens not
        // console.log("happening again :[");
    }
}

function postFace() {
    socket.emit('isGettingFaces', true); //post isInFrame bool
    console.log("isGettingFaces");
    //TODO add image info to face object
    socket.emit('newFace', face); //post image obj
}

function toggleSession() { //CLOSE EYES AND SMILE TO TOGGLE SESSION
    console.log("here1");
    // if (isFacingCamera.val) {
    // console.log("here2");
    if (areEyesClosed.val) {
        console.log("here3");
        if (!setSessionOnce) {
            console.log("here4");
            if (isUserAccessing.val) {
                isUserAccessing.val = false;
                console.log("Ending session");
            } else {
                isUserAccessing.val = true; //don't need to send this to server
                console.log("Starting session");
            }
            setSessionOnce = true;
        }
    } else if (!areEyesClosed.val) { //JUST SMILE TO GET A FACE (in session)
        if (isUserAccessing.val) {
            console.log("Getting last face...");
            socket.emit('getLastFace', 0);
        }
    } else { //end if(areEyesClosed)
        setSessionOnce = false; //THIS NEEDS TO BE SET OUTSIDE OF THIS FUNCTION WHERE SMILING AND EYESCLOSED ARE BOTH FALSE
    }
    // }
}

function deleteFace() { //JUST OPEN MOUTH TO DELETE FACE (in session)
    if (isFacingCamera.val) {
        if (isUserAccessing.val && isMouthOpen.val) {
            console.log("Deleting last face...");
            socket.emit('deleteLastFace', 0);
        }
    }
}

window.addEventListener('load', init);

function init() {

    console.log("client.js loaded.");
    // //when face is in frame and facing camera, let things happen
    // isFacingCamera.registerListener(function(val) {
    //     socket.emit('isGettingFaces', val); //post isInFrame bool
    //     console.log("isGettingFaces");
    //     //TODO add image info to face object
    //     socket.emit('newFace', face); //post image obj
    // }); //end if(isFacingCamera)

    // //when user is smiling and eyes are closed, begin or end session
    // isSmiling.registerListener(function(val) {
    //     console.log("SMILING IN CLIENT");
    //     if (isFacingCamera.a) {
    //         if (areEyesClosed.a) {
    //             if (!setSessionOnce) {
    //                 if (isUserAccessing) {
    //                     isUserAccessing = false;
    //                 } else {
    //                     isUserAccessing = true; //don't need to send this to server
    //                 }
    //                 setSessionOnce = true;
    //             }
    //         } else { //end if(areEyesClosed)
    //             setSessionOnce = false;

    //             //get last face when smiling and in session
    //             if (isFacingCamera.a) {
    //                 if (isUserAccessing) {
    //                     socket.emit('getLastFace', 0);
    //                 }
    //             }
    //         }
    //     }
    // });

    // //delete last face when yawning and in session
    // isMouthOpen.registerListener(function(val) {
    //     console.log("YAWNING IN CLIENT");
    //     if (isFacingCamera.a) {
    //         if (isUserAccessing) {
    //             socket.emit('deleteLastFace', 0);
    //         }
    //     }
    // });
}

function uuidv4() { //[2] //generates UID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// function Bool(initialValue) { //[3] event listeners for bools
//     var bool = !!initialValue;
//     var listeners = [];
//     var returnVal = function(value) {
//         if (arguments.length) {
//             var oldValue = bool;
//             bool = !!value;
//             listeners.forEach(function(listener, i, list) {
//                 listener.call(returnVal, {
//                     oldValue: oldValue,
//                     newValue: bool
//                 });
//             });
//         }
//         return bool
//     };
//     returnVal.addListener = function(fn) {
//         if (typeof fn == "function") {
//             listeners.push(fn);
//         } else {
//             throw "Not a function!";
//         }
//     };
//     return returnVal;
// }


function drawFace() {
    //make canvas
    var _extractedFace0 = document.body.createCanvas("_extractedFace0", _size, _size, null);
    var _ctxFace0 = _extractedFace0.getContext("2d");

    var faces = brfManager.getFaces();
    var face0 = faces[0];

}