import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";

interface DualRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom" | "static";
  labelContentPos?: "left" | "right";
  label?: React.ReactNode | ((value: number | undefined) => React.ReactNode);
  title: string;
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(
  (
    {
      className,
      label,
      labelPosition = "top",
      labelContentPos = "right",
      title,
      ...props
    },
    ref
  ) => {
    const initialValue = Array.isArray(props.value)
      ? props.value
      : [props.min, props.max];

    return (
      <>
        <div className="flex items-center pb-3">
          <p className="mr-2 text-sm font-semibold">{title}:</p>
          {initialValue.map((value, index) => (
            <div className="text-sm">
              <motion.span
                className="mr-1 inline-block"
                key={value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {value}
              </motion.span>
              {labelContentPos === "right" && (
                <>
                  {typeof label === "function" ? (
                    <motion.span
                      className="inline-block -translate-y-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {label(value)}
                    </motion.span>
                  ) : (
                    label && (
                      <motion.span
                        className="inline-block"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {label}
                      </motion.span>
                    )
                  )}
                </>
              )}
              {index < initialValue.length - 1 && (
                <span className="px-2">-</span>
              )}
            </div>
          ))}
        </div>
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          {...props}
        >
          {/* Thanh Track */}
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>

          {/* Các điểm kéo (Thumbs) */}
          {initialValue.map((value, index) => (
            <React.Fragment key={index}>
              <SliderPrimitive.Thumb className="focus-visible:ring-ring relative block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                {label && labelPosition !== "static" && (
                  <div
                    className={cn(
                      "absolute flex w-full items-start justify-center gap-0.5",
                      labelPosition === "top" && "-top-7",
                      labelPosition === "bottom" && "top-4"
                    )}
                  >
                    {labelContentPos === "left" && (
                      <>
                        {typeof label === "function" ? (
                          <motion.span
                            className="inline-block -translate-y-0.5"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {label(value)}
                          </motion.span>
                        ) : (
                          label && (
                            <motion.span
                              className="inline-block"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                            >
                              {label}
                            </motion.span>
                          )
                        )}
                      </>
                    )}
                  </div>
                )}
              </SliderPrimitive.Thumb>
            </React.Fragment>
          ))}

          {/* Hiển thị nhãn tĩnh nếu cần */}
          {label && labelPosition === "static" && (
            <>
              {initialValue.map((value, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute -top-7 right-0 flex w-fit items-start justify-center gap-0.5"
                  )}
                >
                  {labelContentPos === "left" && (
                    <>
                      {typeof label === "function" ? (
                        <motion.span
                          className="inline-block -translate-y-0.5"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {label(value)}
                        </motion.span>
                      ) : (
                        label && (
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {label}
                          </motion.span>
                        )
                      )}
                    </>
                  )}
                  <motion.span
                    className="inline-block"
                    key={value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {value}
                  </motion.span>
                  {labelContentPos === "right" && (
                    <>
                      {typeof label === "function" ? (
                        <motion.span
                          className="inline-block -translate-y-1"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {label(value)}
                        </motion.span>
                      ) : (
                        label && (
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {label}
                          </motion.span>
                        )
                      )}
                    </>
                  )}
                </div>
              ))}
            </>
          )}
        </SliderPrimitive.Root>
      </>
    );
  }
);
DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
