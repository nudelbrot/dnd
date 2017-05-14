# DnD Map Creator
see https://nudelbrot.github.io/dnd

## Hotkeys ##
lm == left mouse button
rm == right mouse button

### Navigation ###
| trigger(/alt-trigger)  | action |
|---|---|
| esc(/space) | center viewport to (0/0) |
| w(/up-arrow) | set viewport to (-0/-1) |
| a(/left-arrow) | set viewport to (-1/-0) |
| s(/down-arrow) | set viewport to (+0/-1) |
| d(/right-arrow) | set viewport to (+1/+0) |
| [1..10] + shift | setjumppoint [1..10] at current viewport |
| [1..10] | set viewport to jumppoint [1..10] |
| backspace(/^) | switch viewport to latest position before a jump |

### Pencil Tool ###
| trigger(/alt-trigger)  | action |
|---|---|
| lm-click(/hold) | change cell(s) color to foreground color |
| rm-click(/hold) | change cell(s) color to background color |
| ctrl + lm-click | change foreground color to cell color |
| ctrl + rm-click | change background color to cell color |
| shift + lm-hold  | draw straight line with foreground color|
| shift + rm-hold  | draw straight line with background color|

### Path Tool ###
| trigger | action |
|---|---|
| lm-click | add point. if thats the second click, draw a fg-colored line |
| rm-click | add point. if thats the second click, draw a bg-colored line |
| lm-click + shift | add point. if a point already exist, draw a fg-colored line afterwards remove the previous point|
| rm-click + shift | add point. if a point already exist, draw a bg-colored line afterwards remove the previous point|

### Bucket Tool ###
| trigger(/alt-trigger)  | action |
|---|---|
| lm-click | fill area with foreground color |
| rm-click | fill area with background color |

