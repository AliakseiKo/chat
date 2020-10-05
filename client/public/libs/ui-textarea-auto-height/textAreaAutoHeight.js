function textAreaAutoHeight(textArea, minRows = 1, maxRows = 20, { hideScrollClass = 'taah-scroll_hidden' } = {}) {
  textArea.classList.add(hideScrollClass);

  const computedStyle = window.getComputedStyle(textArea);
  const boxSizingBB = computedStyle.boxSizing === 'border-box';
  const paddings = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
  const borders = textArea.offsetHeight - textArea.clientHeight;
  const lineHeight = (textArea.clientHeight - paddings) / textArea.rows;

  const calcRows = () => parseFloat(textArea.scrollHeight - paddings) / lineHeight;

  const setClientHeight = (clientHeight) => {
    textArea.style.height = (boxSizingBB)
      ? clientHeight + borders + 'px'
      : clientHeight - paddings + 'px';
  };

  const updateTextArea = () => {
    textArea.classList.add(hideScrollClass);
    let rows = calcRows();

    if (textArea.scrollHeight !== textArea.clientHeight) {
      if (rows > maxRows) textArea.classList.remove(hideScrollClass);
      else setClientHeight(textArea.scrollHeight);
    } else {
      while (textArea.scrollHeight === textArea.clientHeight && (rows = calcRows()) > minRows) {
        setClientHeight(textArea.clientHeight - lineHeight);
      }
      setClientHeight(textArea.scrollHeight);
    }
  }

  updateTextArea();

  textArea.addEventListener('input', updateTextArea);

  return () => textArea.removeEventListener('input', updateTextArea);
}
