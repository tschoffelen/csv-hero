export const uploadPart = async (
  data: string | Blob,
  filename = "data.json",
  contentType = "application/json"
) => {
  const res = await fetch(
    `https://mirri.link/api/get-url?filename=${encodeURIComponent(
      filename
    )}&contentType=${encodeURIComponent(contentType)}`
  );
  const { url, key } = await res.json();

  await fetch(url, {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });

  return key;
};

export const uploadData = async (
  data: any,
  name: string,
  transforms: any[]
) => {
  const payload = {
    data,
    name,
    transforms,
  };

  return uploadPart(
    JSON.stringify(payload),
    "csvhero.json",
    "application/json"
  );
};
