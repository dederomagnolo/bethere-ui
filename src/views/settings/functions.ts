

export const getTimeOptions = () => {
  const timeOptions = [] as any;

  for (let i = 1; i <= 24; i++) {
    timeOptions.push({
      value: i,
      label: `${i === 24 ? '0' : i}h00`,
    });
  }

  return timeOptions
}