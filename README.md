# :star2: Wands of Triskaideka 🌟

_An entry for 2024 js13k game jam. Theme is Triskaidekaphobia_

✨ :blush:

Once upon a time, there is a wizard, Trika, who is a freshman in the Deka Academy.

He does not perform well in his class and all his classmates, even his teachers, are all teasing him about how bad and unfit he is.

One day, he wandered into the Lost Woods and found a mysterious wand.

He picked that up, wishing to find its original owner.

However unfortune starts to befall him.....

## Gameplay

- Press :arrow_left: to move left, :arrow_right: to move right
- Press :arrow_up: to jump
- Press `C` to shoot fireballs
- Spikeballs can hurt you now

## Post-mortem (just after the deadline of js13k-2024)

### The beginning

Triskaidekaphobia... How many letters are there ? `(17)`

When the theme pops up, there are several ideas that come to my head.

- 2d platformer but every 13 steps something potentially dangerous approaches you. However it can help you trigger switches or attack enemies.
- Vampire Surviors but it is Ender who wants to hands everybody swags but all people are too busy with their game hence avoiding him.
- Blackjack but you bust at multiples of 13.
- Uno but you lose if the sum of numbers in the discard pile is multiples of 13 after you played.

There are like several ideas but all of them are my first time to try the genre and they are potentially very hard for me to start.

The first idea seems pretty easy to implement so I went with this idea instead.

It is also pretty easy for me to add more elements like fireballs towards the player,

spikes that would appear near proximity of the player,

or even or homing aim where the Trica can get shot by it (and potentially hurt enemies)

### Struggle bus

LittleJS is a new engine to me and I have heard a lot of wonderful things about it. I did my first js13k game (DEATH) using Kontra and I want to give this a try.

So I started reading its example code to understand how to use this engine. I quickly learnt that reading JS code is not fun. :frowning: :frowning:

A lot of props and variables just happen out of thin air without initialization on the same file and I had a hard time tracing it.

I am also a noob in compression, optimisation stuff so I thought I could just go with a LittleJS template and be fine with it.

It took me a week to realise there is no tree-shakable function in those templates.

I immediately went to Vite and embrace Typescript and also the js13k-vite-plugins. Kudos to (Mr. Cody Ebberson)[https://github.com/codyebberson] for such an amazing plugin. :tophat: :tophat: :tophat:

### Optimization new bee

my struggles when trying to compress.

I am a fan of ECS (entity-component-system) archeiteture. I find it easy enough to implement my game logic while keep my coding organised.

I have been reading on (biteECS)[https://github.com/NateTheGreatt/bitECS] for a pretty long time and I guess I should give a try. I went on using it, coding my game logic around it.

And for my peace of mind, I decided to make a build to see what is the current build size and guess what. It is already over 13kB. And my game is incomplete.

What went wrong ? I tried to find where is the bulk of my game. I tried to remove bitECS from my build and well, a big chunk of space (~3kB) just appeared.

So I decided to redo all of my game logic while also removing unnecessary mechanics.

Credits to (KilledByAPixel)[https://github.com/KilledByAPixel] for his LittleJS engine and his wonderfull platformer example. I would not be able to complete without it.

In addition, there are a couple of places that can be optimised. Uncompressed PNG and Tilemap JSON files. So the solutions are compression and array data for my tilemap.

I even had to redesign my map into a semi-procedural generated dungeon too as I only included first few lines of level and randomly generated the rest. (Now that I realised bitECS might not have taken that much of the space...)

Just by implementing a few basic mechanics, I quickly uploaded the draft and shared that among Slack and Discord to gather some feedbacks. The feedbacks are great as you can figure out your next feature to work on or your next bug to kill. And how to gain other people's perspective.

Anyways, by squeezing some time from my IRL, I managed to tweak a few params, polish and close the game loop in my game, just 1 day before submission to avoid panic attacks.

### Post-submission reflect

Eventually, the end game turns out to be a single room that Trica is at the top and he has to keep moving to spawn spikeballs that break blocks.

The goal is located at the end of the room, the bottom level, so he has to keep breaking blocks to reach.

I also added a shooter so that Trica can push the spikeballs with his magic instead.

But I realised that this game has to be movement-heavy because the mechanics are driven based on movements, or else nothing happens. It could become boring quickly

...

Within a lock room, there is not much to move about and I did not include any traps or movables in this build. (Scope-creep avoidance) 

### Post-jam ??

I have to admit that the current version is not that exciting. I have to make more traps or complex platform so that Trica can move around more.

I have thought of introducing wave-function-collapse at one point but the coding burden is too big for me in this jam.

Probably in the post jam version I can take this opportunity to make one.

Also I need to include more Death-per-13-steps mechanic so it can becomre more like a bullet-hell platformer game 😄.
