#express_yourself 🤗
##Face-gestural API

###Control flows

####Control flow 1

When face is in frame (`isInFrame`) and `isFacingCamera`:

POST: capture image of face (see `face` object) and push to server

####Control flow 2 *(happens concurrently with control flow 1)*

When eyes are closed and user smiles (`areEyesClosed` && `isSmiling`):

Start session with this person

*Starting a session means camera starts listening for signals to do 1 of the following:*

 - When user is smiling (`isSmiling`):
	 - GET last face (`face` object) added to server
 - When user is "yawning" (`isMouthOpen`):
 	 - DELETE last face (`face` object) added to server
 - When user's eyes are closed and user is smiling (`areEyesClosed` && `isSmiling`):
	 - End session with this person

*When a session is terminated the camera goes back to listening for the "start session" command (`areEyesClosed` && `isSmiling`).*

####Data structure:

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
        "isGettingFaces": "bool",
        "success": "bool",
        "status": "int"
    } 

The `isGettingFaces` bool returns `true` when the client (your camera) is currently capturing pics of your face and sending them to the server (see control flow 1). The `success` and `staus` bools are telling you if your request was successful or not. 

###License

Made with [Beyond Reality Face SDK](https://github.com/Tastenkunst/brfv4_javascript_examples) with the following license:

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

