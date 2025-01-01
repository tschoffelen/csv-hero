import { transformDefinitions } from "@/lib/transforms/definitions";

const Placeholder = ({ ...props }) => {
  return (
    <div
      className="bg-gray-900 h-screen flex w-full flex flex-col items-center justify-center"
      {...props}
    >
      <div className="bg-gray-800 rounded-full h-48 w-48 aspect-square flex mb-10 items-center justify-center">
        <svg
          viewBox="0 0 20 20"
          className="h-24 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M16 1H4c-.56 0-1 .44-1 1v16c0 .55.44 1 1 1h12c.55 0 1-.45 1-1V2c0-.552-.45-1-1-1Zm-1 7H9v9H8V8H5V7h3V3h1v4h6v1Z"
          />
        </svg>
      </div>
      <p className="text-gray-400">
        Drop a CSV or JSON file to start formatting data
      </p>
      <div className="flex gap-4 mt-6">
        {transformDefinitions.map(({ id, icon: Icon }) => (
          <div key={id}>
            <Icon className="h-4 w-4 text-gray-500" />
          </div>
        ))}
      </div>
      <a
        className="fixed bottom-2 right-2 opacity-20 hover:opacity-100 transition-opacity"
        href="https://includable.com/?utm_source=csvhero.schof.co"
        title="Powered by Includable"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="63px"
          height="16px"
          viewBox="0 0 63 16"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-159.000000, -86.000000)" className="fill-gray-400">
              <path d="M218.8,86 C220.567311,86 222,87.4326888 222,89.2 L222,98.8 C222,100.567311 220.567311,102 218.8,102 L162.8,102 C161.032689,102 159.6,100.567311 159.6,98.8 L159.6,89.2 C159.6,87.4326888 161.032689,86 162.8,86 L218.8,86 Z M176.7606,92.176 C175.1346,92.176 173.9966,93.2824 173.9966,94.8932 C173.9966,96.5036 175.1398,97.6 176.6926,97.6 C177.747,97.6 178.5606,97.18 179.0114,96.656 L178.0462,95.806 C177.7994,96.084 177.385,96.3356 176.829,96.3356 C175.995,96.3356 175.423,95.742 175.423,94.882 C175.423,94.032 175.979,93.4392 176.819,93.4392 C177.28974,93.4332677 177.738235,93.6391584 178.0406,94 L178.9902,93.1816 C178.4602,92.5168 177.5942,92.176 176.7606,92.176 Z M194.3282,89.6 L192.9214,89.6 L192.9214,92.8576 L192.895,92.8576 C192.5018,92.4068 191.951,92.176 191.311,92.176 C189.905,92.176 188.8402,93.3088 188.8402,94.904 C188.8402,96.524 189.8998,97.6 191.3538,97.6 C192.0518,97.6 192.5918,97.3428 192.959,96.876 L192.9902,96.876 L192.9902,97.5108 L194.3282,97.5108 L194.3282,89.6 Z M203.6702,89.6 L202.2642,89.6 L202.2642,97.5104 L203.6066,97.5104 L203.6066,96.876 L203.6334,96.876 C204.0006,97.3428 204.541,97.6 205.2382,97.6 C206.691,97.6 207.751,96.524 207.751,94.904 C207.751,93.308 206.6862,92.176 205.2802,92.176 C204.6402,92.1756 204.0898,92.4068 203.6962,92.8576 L203.6702,92.8576 L203.6702,89.6 Z M214.1498,92.176 C212.6598,92.176 211.5478,93.2884 211.5478,94.8832 C211.5478,96.5196 212.7122,97.6004 214.2494,97.6004 C215.3038,97.6004 216.0698,97.1752 216.5158,96.6084 L215.603,95.7592 C215.3142,96.11 214.8998,96.3568 214.349,96.3512 C213.6778,96.346 213.1794,95.9684 213.0114,95.3444 L216.689,95.3444 C216.715,95.2496 216.725,95.0084 216.725,94.8404 C216.7258,93.304 215.6926,92.176 214.1498,92.176 Z M197.9106,92.176 C196.5046,92.176 195.4398,93.3088 195.4398,94.904 C195.4398,96.524 196.4994,97.6 197.9526,97.6 C198.6294,97.6 199.1594,97.3428 199.5214,96.876 L199.5474,96.876 L199.5474,97.5108 L200.8854,97.5108 L200.8854,92.2652 L199.48,92.265 L199.4802,92.8576 L199.4586,92.8576 C199.0706,92.4064 198.5306,92.176 197.9106,92.176 Z M184.2454,92.264 L182.8398,92.264 L182.8398,95.422 C182.8398,97.022 183.6374,97.5992 184.7706,97.5992 C185.3642,97.5992 185.9202,97.3528 186.3294,96.87 L186.3502,96.87 L186.3502,97.51 L187.7558,97.51 L187.7558,92.2648 L186.3494,92.2648 L186.3494,94.8088 C186.3494,95.8268 185.7986,96.3356 185.1854,96.3356 C184.5294,96.3356 184.2454,96.0196 184.2454,95.0556 L184.2454,92.264 Z M171.0442,92.176 C170.3978,92.176 169.7894,92.438 169.359,92.9416 L169.343,92.9416 L169.343,92.2648 L167.9382,92.2648 L167.9382,97.5108 L169.3442,97.5108 L169.3442,94.872 C169.3442,93.9384 169.8218,93.44 170.535,93.44 C171.1858,93.44 171.5422,93.7496 171.5422,94.752 L171.5422,97.516 L172.9482,97.516 L172.9482,94.4 C172.9482,92.784 172.1666,92.176 171.0442,92.176 Z M166.4478,92.2648 L165.0422,92.2648 L165.0422,97.5108 L166.4478,97.5108 L166.4478,92.2648 Z M181.461,89.6 L180.055,89.6 L180.055,97.5108 L181.461,97.5108 L181.461,89.6 Z M210.3626,89.6 L208.957,89.6 L208.957,97.5108 L210.3626,97.5104 L210.3626,89.6 Z M191.6158,93.44 C192.419,93.44 192.9958,94.0692 192.9958,94.9092 C192.9958,95.7692 192.3822,96.3412 191.611,96.3412 C190.8238,96.3408 190.2678,95.7588 190.2678,94.9088 C190.2678,94.012 190.861,93.44 191.6158,93.44 Z M198.2142,93.44 C198.975,93.44 199.5362,94.0692 199.5362,94.9092 C199.5362,95.7692 198.9378,96.3412 198.2098,96.3412 C197.4222,96.3408 196.8662,95.7588 196.8662,94.9088 C196.8662,94.012 197.4594,93.44 198.2142,93.44 Z M204.981,93.4396 C205.731,93.4396 206.3238,94.0116 206.3238,94.9088 C206.3238,95.7584 205.773,96.3408 204.981,96.3408 C204.209,96.3396 203.601,95.7676 203.601,94.9076 C203.601,94.0688 204.173,93.4396 204.981,93.4396 Z M214.1974,93.4132 C214.8062,93.4132 215.189,93.7756 215.3302,94.3316 L213.017,94.3316 C213.1794,93.7232 213.625,93.4136 214.197,93.4136 Z M165.745,89.81 C165.2622,89.81 164.8742,90.198 164.8742,90.6648 C164.8742,91.1424 165.2622,91.5248 165.745,91.5248 C166.2226,91.5252 166.6158,91.1424 166.6158,90.6652 C166.6158,90.198 166.2226,89.81 165.745,89.81 Z" />
            </g>
          </g>
        </svg>
      </a>
    </div>
  );
};

export default Placeholder;
