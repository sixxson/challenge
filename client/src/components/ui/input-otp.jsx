"use client"

import React, {
  createContext,
  useContext,
  forwardRef,
  useRef,
} from "react"
import { Minus } from "lucide-react"
import { cn } from "../../lib/utils"

const OTPInputContext = createContext({ slots: [] })

const InputOTP = forwardRef(
  ({ value = "", onChange, length = 6, containerClassName, className }, ref) => {
    const slots = Array.from({ length }).map((_, index) => {
      const char = value[index] || ""
      const isActive = value.length === index
      return { char, isActive }
    })

    // Tạo ref list để điều khiển focus
    const inputRefs = useRef([])

    const handleSlotChange = (index, newChar) => {
      const chars = value.split("")
      chars[index] = newChar
      const newValue = chars.join("").slice(0, length)
      onChange(newValue)

      // ✅ Focus ô tiếp theo nếu có
      const next = inputRefs.current[index + 1]
      if (next) next.focus()
    }

    return (
      <OTPInputContext.Provider value={{ slots }}>
        <div
          ref={ref}
          className={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
        >
          {Array.from({ length }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={className}
              onChangeSlot={handleSlotChange}
              inputRef={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
      </OTPInputContext.Provider>
    )
  }
)
InputOTP.displayName = "InputOTP"

const InputOTPSlot = forwardRef(({ index, onChangeSlot, inputRef, className, ...props }, ref) => {
  const { slots } = useContext(OTPInputContext)
  const { char, isActive } = slots[index]

  return (
    <input
      ref={(el) => {
        inputRef?.(el)
        if (ref) ref.current = el
      }}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={char}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, "")
        if (val && onChangeSlot) {
          onChangeSlot(index, val)
        }
      }}
      onFocus={(e) => e.target.select()}
      className={cn(
        "w-9 h-9 text-center border border-input rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}
    />
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPGroup = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSeparator = forwardRef((props, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export {
  InputOTP,
  OTPInputContext,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
}
