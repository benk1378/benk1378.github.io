---
layout: default
---

## Robotics

For my Robotics class we had to work in teams of 4 and use a plethora of tools to create a vision system for our robot. We used Jetson Nanos provided by Nvidia to run our vision system and capture video in real time, and we used arduinos and motors to control the wheels corresponding to the generated depth map. Most of the class was spent on undertanding the math required for the depth calculation, then applying it using the OpenCV library, as well as learning how to write CUDA code so the calculation could be parallelized on the GPU.

[GitHub repo](https://github.com/Andrew-Gallimore/Visions_of_Robotics)

[back](/)

Some photos and videos of development below

* * *

One of the events for the final where each team's robot competed, and we got 3rd place overall



Our first test of the fully working robot


/assets/vid/robotestrun.MOV

Debugging our depth map calculations in the hallway

/assets/vid/robodebug.MOV

Testing out an edge detection algorithm


![](/assets/img/roboedgetest.jpg)

Some camera calibration


![](/assets/img/robocalibration.jpg)
