express_yourself 🤗
===================

Face-gestural API created with [Beyond Reality Face SDK for javascript](https://github.com/Tastenkunst/brfv4_javascript_examples). See `/js/examples/face_tacking/restrict_to_center.js` for our ([Richard Lapham](https://github.com/Rlapham), [Andrew McCausland](https://github.com/mccap079)) added code, including all socket (via [socket.io](https://github.com/socketio/socket.io)) communication with server and gesture implementation. See `server.js` for server-side implementation.

Controls
--------

**POST**
Blink. Currently posts dummy image to server. Can post any data you'd like.

**GET**
Yawn. Pull the last image posted.

**DELETE**
Smile. Delete the last image posted. 

Data structure:
---------------

The only data stored are images of faces (in an aray) and a few vars regarding status and current state. Each image has a unique ID (**not really using at the moment**), a string identifying the specific feature (**currently not implemented, sorry**) and a url to its location on the server:

    {
        "images": [{
            "id": "int",
            "feature": "string",
            "url": "string"
        }, {
            "id": "int",
            "feature": "string",
            "url": "string"
        }]
    } 

`id`: unique id for each image posted. See `uuidv4()` in `/js/examples/face_tacking/restrict_to_center.js`.

`feature`: stringdenoting the subject of the image. Not automated in any way at the moment, just a custom string implementation.

`url`: location on the server.

License
-------

Via [Beyond Reality Face SDK](https://github.com/Tastenkunst/brfv4_javascript_examples):

    <!--
    Stump-based 24x24 discrete(?) adaboost frontal face detector.
    Created by Rainer Lienhart.

    ////////////////////////////////////////////////////////////////////////////////////////

    IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.

    By downloading, copying, installing or using the software you agree to this license.
    If you do not agree to this license, do not download, install,
    copy or use the software.


                        Intel License Agreement
                For Open Source Computer Vision Library

     Copyright (C) 2000, Intel Corporation, all rights reserved.
     Third party copyrights are property of their respective owners.

     Redistribution and use in source and binary forms, with or without modification,
     are permitted provided that the following conditions are met:

    * Redistribution's of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.

    * Redistribution's in binary form must reproduce the above copyright notice,
     this list of conditions and the following disclaimer in the documentation
     and/or other materials provided with the distribution.

    * The name of Intel Corporation may not be used to endorse or promote products
     derived from this software without specific prior written permission.

     This software is provided by the copyright holders and contributors "as is" and
     any express or implied warranties, including, but not limited to, the implied
     warranties of merchantability and fitness for a particular.purpose are disclaimed.
     In no event shall the Intel Corporation or contributors be liable for any direct,
     indirect, incidental, special, exemplary, or consequential damages
     (including, but not limited to, procurement of substitute goods or services;
     loss of use, data, or profits; or business interruption) however caused
     and on any theory of liability, whether in contract, strict liability,
     or tort (including negligence or otherwise) arising in any way out of
     the use of this software, even if advised of the possibility of such damage.
     -->

