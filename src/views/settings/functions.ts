

export const getTimeOptions = () => {
  const timeOptions = [] as any;

  for (let i = 0; i < 24; i++) {
    timeOptions.push({
      value: i,
      label: `${i}h`,
    });
  }

  return timeOptions
}