import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-feather";

const ShareModal = ({ open, setOpen }) => {
  return (
    <Transition.Root show={!!open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-12 text-center sm:block sm:p-0">
            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-12 sm:py-10 sm:px-8">
                <div className="text-center">
                  <div
                    className="w-14 h-14 inline-flex items-center justify-center rounded-full overflow-hidden bg-emerald-100 mb-4">
                    <Link className="w-7 h-7 text-emerald-600" />
                  </div>
                  <Dialog.Title as="h3" className="text-lg leading-6 font-semibold text-gray-900">
                    Share link
                  </Dialog.Title>
                  <p className="text-gray-500 text-sm mt-2 mb-4">
                    Share your source data, as well as any transformations.
                  </p>
                </div>

                <div className="mt-5 sm:mt-8 mx-3 text-center">
                  <input
                    type="text"
                    className="w-full text-center text-sm select-all p-3 border border-gray-300 hover:bg-gray-100 active:bg-gray-100 text-blue-500 font-medium rounded-md"
                    value={open}
                    readOnly />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ShareModal;
