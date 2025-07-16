# 🧙‍♂️ Interactive Gnome Adventure

A fun browser-based game where you watch a little gnome automatically explore a field filled with bombs and flowers!

## How to Play

1. **Set up the field**: Choose your field size, number of bombs, and number of flowers
2. **Click "Generate Field"** to create a new adventure
3. **Watch the gnome**: The gnome will automatically start walking around the field
4. **Collect flowers for healing**: The gnome heals by collecting flowers (🌸) - each flower restores 1 health point
5. **Avoid bombs**: The gnome loses health when stepping on bombs (💣)
6. **Win condition**: Collect all flowers to win!
7. **Lose condition**: If the gnome's health reaches 0, game over!

## Features

- **Automatic movement**: The gnome walks around on its own
- **Health system**: Gnome starts with 3 hearts ❤️
- **Flower healing**: Flowers heal the gnome (up to 3 health max) and disappear when collected
- **Bomb explosions**: Gnome gets hurt by bombs but can survive
- **Win/lose conditions**: Clear objectives and game states
- **Beautiful animations**: Smooth walking, explosions, and state changes
- **Customizable fields**: Adjust size, bomb count, and flower count
- **Strategic gameplay**: Balance risk vs reward - flowers heal but may be near bombs

## Game Controls

- **Field Size**: Choose from 5x5 to 20x20
- **Bomb Count**: Set how many dangerous bombs to place
- **Flower Count**: Set how many flowers the gnome needs to collect
- **Generate Field**: Create a new random field and start the adventure

## Visual States

- 🧙‍♂️ **Happy gnome**: Normal walking state
- 🌟 **Collecting**: Gnome found a flower!
- 💥 **Exploding**: Gnome hit a bomb!
- 💀 **Dead**: Game over - gnome ran out of health

## Play Online

Just open `index.html` in any modern web browser - no installation required!

---

*Built with HTML, CSS, and JavaScript. Pure client-side fun!* 