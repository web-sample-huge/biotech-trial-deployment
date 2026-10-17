# Lottie Animation Files

Place your Lottie animation JSON files here.

## Required Animation
- `paddy-growth.json` - The scroll-synced paddy crop growth animation

## Animation Requirements

### Frame Structure (~48 frames recommended)
The animation should depict the complete growth cycle:

| Scroll Progress | Frames | Stage | Visual Description |
|-----------------|--------|-------|---------------------|
| 0% - 15% | 1-7 | Seeding | Seeds in soil, DNA/Plant molecule floating |
| 15% - 45% | 8-22 | Germination | Roots emerging with neon-green vitality |
| 45% - 85% | 23-41 | Maturation | Paddy crops expanding, filling the screen |
| 85% - 100% | 42-48 | Harvest | Golden glow over fully grown crops |

### Color Guidelines
- Use neon green (#39FF14) for growing elements
- Use harvest gold (#FFD700) for the harvest stage
- Use neon blue (#00D4FF) for the initial DNA/molecule

### Technical Notes
- Animation will be controlled via `goToAndStop(frame, true)`
- `autoplay` and `loop` will be disabled
- Use vector graphics for optimal scaling
- Keep file size under 500KB for rural 4G performance

## Creating the Animation
You can create Lottie animations using:
- Adobe After Effects + Bodymovin plugin
- LottieFiles.com editor
- Haiku Animator
- Figma plugins (e.g., LottieFiles for Figma)

## Testing
Use https://lottiefiles.com/preview to test your animation before integration.
