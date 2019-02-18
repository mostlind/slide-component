# A commponent to implement a slide animation

```javascript
<Collapsible
  animationLengthMs={openMs}
  closeDelayMs={closeDelayMs}
  isOpen={isOpen}
>
  <div>something to collapse</div>
</Collapsible>
```

### props

- `isOpen`: `boolean` - Whether the component is closed or not
- `animationLengthMs`: `number` - Length of the slide animation in milliseconds
- `closeDelayMs`: `number` - How long to wait after `isOpen` is false to close the element
