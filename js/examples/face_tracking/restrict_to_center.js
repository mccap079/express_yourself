var socket = io.connect();

(function exampleCode() {
    "use strict";

    var Centered = false;
    var Yawned = false;
    var Blinked = false;
    var Smiled = false;
    var updateConsole;
    var _faceDetectionRoi = new brfv4.Rectangle();

    brfv4Example.initCurrentExample = function(brfManager, resolution) {

        brfManager.init(resolution, resolution, brfv4Example.appId);

        // Sometimes you want to restrict the position and pose of a face.

        // In this setup we will restrict pick up of the face to the center of the image
        // and we will let BRFv4 reset if the user turns his head too much.

        // We limit the face detection region of interest to be in the central
        // part of the overall analysed image (green rectangle).

        _faceDetectionRoi.setTo(
            resolution.width * 0.25, resolution.height * 0.10,
            resolution.width * 0.50, resolution.height * 0.80
        );
        brfManager.setFaceDetectionRoi(_faceDetectionRoi);

        // We can have either a landscape area (desktop), then choose height or
        // we can have a portrait area (mobile), then choose width as max face size.

        var maxFaceSize = _faceDetectionRoi.height;

        if (_faceDetectionRoi.width < _faceDetectionRoi.height) {
            maxFaceSize = _faceDetectionRoi.width;
        }

        // Use the usual detection distances to be able to tell the user what to do.

        brfManager.setFaceDetectionParams(maxFaceSize * 0.30, maxFaceSize * 1.00, 12, 8);

        // Set up the pickup parameters for the face tracking:
        // startMinFaceSize, startMaxFaceSize, startRotationX/Y/Z

        // Faces will only get picked up, if they look straight into the camera
        // and have a certain size (distance to camera).

        brfManager.setFaceTrackingStartParams(maxFaceSize * 0.50, maxFaceSize * 0.70, 15, 15, 15);

        // Set up the reset conditions for the face tracking:
        // resetMinFaceSize, resetMaxFaceSize, resetRotationX/Y/Z

        // Face tracking will reset to face detection, if the face turns too much or leaves
        // the desired distance to the camera.

        brfManager.setFaceTrackingResetParams(maxFaceSize * 0.45, maxFaceSize * 0.75, 25, 25, 25);
    };

    brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

        brfManager.update(imageData);

        draw.clear();

        draw.drawRect(_faceDetectionRoi, false, 2.0, 0x8aff00, 0.5);
        draw.drawRects(brfManager.getAllDetectedFaces(), false, 1.0, 0x00a1ff, 0.5);

        var mergedFaces = brfManager.getMergedDetectedFaces();

        draw.drawRects(mergedFaces, false, 2.0, 0xffd200, 1.0);

        var faces = brfManager.getFaces();
        var oneFaceTracked = false;

        for (var i = 0; i < faces.length; i++) {

            var face = faces[i];

            if (face.state === brfv4.BRFState.FACE_TRACKING) {

                // Read the rotation of the face and draw it
                // green if the face is frontal or
                // red if the user turns the head too much.

                var maxRot = brfv4.BRFv4PointUtils.toDegree(
                    Math.max(
                        Math.abs(face.rotationX),
                        Math.abs(face.rotationY),
                        Math.abs(face.rotationZ)
                    )
                );

                var percent = maxRot / 20.0;
                // console.log("center" + percent);
                if (percent <= .3) {
                    Centered = true;
                } else {
                    Centered = false;
                }
                // console.log("centered" + Centered);



                if (percent < 0.0) {
                    percent = 0.0;
                }
                if (percent > 1.0) {
                    percent = 1.0;
                }

                var color =
                    (((0xff * percent) & 0xff) << 16) +
                    (((0xff * (1.0 - percent) & 0xff) << 8));

                draw.drawTriangles(face.vertices, face.triangles, false, 1.0, color, 0.4);
                draw.drawVertices(face.vertices, 2.0, false, color, 0.4);

                oneFaceTracked = true;


                ///Smile
                // Smile Detection
                if (Centered) {

                    setPoint(face.vertices, 48, p0); // mouth corner left
                    setPoint(face.vertices, 54, p1); // mouth corner right

                    var mouthWidth = calcDistance(p0, p1);

                    setPoint(face.vertices, 39, p1); // left eye inner corner
                    setPoint(face.vertices, 42, p0); // right eye outer corner

                    var eyeDist = calcDistance(p0, p1);
                    var smileFactor = mouthWidth / eyeDist;

                    smileFactor -= 1.40; // 1.40 - neutral, 1.70 smiling

                    if (smileFactor > 0.25) smileFactor = 0.25;
                    if (smileFactor < 0.00) smileFactor = 0.00;

                    smileFactor *= 4.0;

                    if (smileFactor < 0.0) {
                        smileFactor = 0.0;
                    }
                    if (smileFactor > 1.0) {
                        smileFactor = 1.0;
                    }
                    // console.log("smileFactor" + smileFactor);
                    if (smileFactor == 1) {
                        if (!Smiled) {
                            console.log("DELETE (smiled)");
                            socket.emit('deleteLastFace', 0);
                        }
                        Smiled = true;
                    } else {
                        Smiled = false;
                    }
                } //centerd 
                ///END SMILE


                ///blink
                if (Centered) {

                    var v = face.vertices;

                    if (_oldFaceShapeVertices.length === 0) storeFaceShapeVertices(v);

                    var k, l, yLE, yRE;

                    // Left eye movement (y)

                    for (k = 36, l = 41, yLE = 0; k <= l; k++) {
                        yLE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
                    }
                    yLE /= 6;

                    // Right eye movement (y)

                    for (k = 42, l = 47, yRE = 0; k <= l; k++) {
                        yRE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
                    }

                    yRE /= 6;

                    var yN = 0;

                    // Compare to overall movement (nose y)

                    yN += v[27 * 2 + 1] - _oldFaceShapeVertices[27 * 2 + 1];
                    yN += v[28 * 2 + 1] - _oldFaceShapeVertices[28 * 2 + 1];
                    yN += v[29 * 2 + 1] - _oldFaceShapeVertices[29 * 2 + 1];
                    yN += v[30 * 2 + 1] - _oldFaceShapeVertices[30 * 2 + 1];
                    yN /= 4;

                    var blinkRatio = Math.abs((yLE + yRE) / yN);

                    if ((blinkRatio > 12 && (yLE > 0.4 || yRE > 0.4))) {
                        // console.log("blink " + blinkRatio.toFixed(2) + " " + yLE.toFixed(2) + " " +
                        //     yRE.toFixed(2) + " " + yN.toFixed(2));

                        blink();
                    }

                    // Let the color of the shape show whether you blinked.

                    var color = 0x00a0ff;

                    if (_blinked) {
                        color = 0xffd200;
                    }

                    // Face Tracking results: 68 facial feature points.

                    // draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
                    // draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);

                    brfv4Example.dom.updateHeadline("BRFv4 - advanced - face tracking - simple blink" +
                        "detection.\nDetects an eye  blink: " + (_blinked ? "Yes" : "No"));

                    storeFaceShapeVertices(v);
                } // centerd
                ////END blink


                ///Yawn
                if (Centered) {

                    setPoint(face.vertices, 39, p1); // left eye inner corner
                    setPoint(face.vertices, 42, p0); // right eye outer corner

                    var eyeDist = calcDistance(p0, p1);

                    setPoint(face.vertices, 62, p0); // mouth upper inner lip
                    setPoint(face.vertices, 66, p1); // mouth lower inner lip

                    var mouthOpen = calcDistance(p0, p1);
                    var yawnFactor = mouthOpen / eyeDist;

                    yawnFactor -= 0.35; // remove smiling

                    if (yawnFactor < 0) yawnFactor = 0;

                    yawnFactor *= 4.0; // scale up a bit

                    if (yawnFactor > 1.0) yawnFactor = 1.0;

                    if (yawnFactor < 0.0) {
                        yawnFactor = 0.0;
                    }
                    if (yawnFactor > 1.0) {
                        yawnFactor = 1.0;
                    }
                    if (yawnFactor > 0.6) {
                        if (!Yawned) {
                            socket.emit('getLastFace', 0);
                            console.log("GET (yawned)");
                        }
                        Yawned = true;

                    } else {
                        Yawned = false;
                    }
                } ///centered
                ////END YAWN


                ///DOM update

                var console_update = document.createElement("console_update");
                var text = document.createTextNode(Yawned);
                console_update.appendChild(text);
            }
        }


        // Check, if the face is too close or too far way and tell the user what to do.

        if (!oneFaceTracked && mergedFaces.length > 0) {

            var mergedFace = mergedFaces[0];

            if (mergedFace.width < _faceDetectionRoi.width * 0.50) { // startMinFaceSize

                brfv4Example.dom.updateHeadline("BRFv4 - basic - face tracking - restrict to frontal and center\n" +
                    "Only track a face if it is in a certain distance. Come closer.");

            } else if (mergedFace.width > _faceDetectionRoi.width * 0.70) { // startMaxFaceSize

                brfv4Example.dom.updateHeadline("BRFv4 - basic - face tracking - restrict to frontal and center\n" +
                    "Only track a face if it is in a certain distance. Move further away.");
            }

        } else {

            brfv4Example.dom.updateHeadline("BRFv4 - basic - face tracking - restrict to frontal and center\n" +
                "Only track a face if it is in a certain distance to the camera and is frontal.");
        }
    };


    ///Smile
    var p0 = new brfv4.Point();
    var p1 = new brfv4.Point();

    var setPoint = brfv4.BRFv4PointUtils.setPoint;
    var calcDistance = brfv4.BRFv4PointUtils.calcDistance;
    ///END SMILE


    ////BLINK
    function blink() {
        _blinked = true;
        if (!Blinked) {
            var img = new Image();
            img.src = 'assets/brfv4_lion.png';
            var face = {
                id: uuidv4(),
                feature: "face",
                url: img.src
            };
            socket.emit('newFace', face); //POST image obj
            console.log("POST (blinked)");
        }
        Blinked = true;

        if (_timeOut > -1) {
            clearTimeout(_timeOut);
        }

        _timeOut = setTimeout(resetBlink, 150);
    }

    function resetBlink() {
        _blinked = false;
        Blinked = false;
    }

    function uuidv4() { //generates UID - https://stackoverflow.com/a/2117523/1757149
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function storeFaceShapeVertices(vertices) {
        for (var i = 0, l = vertices.length; i < l; i++) {
            _oldFaceShapeVertices[i] = vertices[i];
        }
    }

    var _oldFaceShapeVertices = [];
    var _blinked = false;
    var _timeOut = -1;
    ////END BLINK


    ////YAWN
    var p0 = new brfv4.Point();
    var p1 = new brfv4.Point();

    var setPoint = brfv4.BRFv4PointUtils.setPoint;
    var calcDistance = brfv4.BRFv4PointUtils.calcDistance;
    ///END YAWN




    brfv4Example.dom.updateHeadline("BRFv4 - basic - face tracking - restrict to frontal and center\n" +
        "Only track a face if it is in a certain distance to the camera and is frontal.");

    brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();