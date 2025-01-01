export const uploadData = async(data, name, transforms) => {
  const payload = {
    data, name, transforms
  };

  const res = await fetch(`https://schof.link/api/get-url?filename=csvhero.json&contentType=${encodeURIComponent("application/json")}`);
  const { url, key } = await res.json();

  await fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "inline; filename=\"csvhero.json\""
    }
  });

  return key;
};
