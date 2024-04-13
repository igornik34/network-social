import React, { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "../../components/input/input"
import { Button, Link } from "@nextui-org/react"
import { Tabs } from "../../pages/auth"
import { hasErrorField } from "../../utils/has-error-field"
import { useRegisterMutation } from "../../app/services/userApi"
import { ErrorMessage } from "../../components/error-message"
import { useNavigate } from "react-router-dom"

type Register = {
  email: string
  name: string
  password: string
    repeatPassword: string
}

type Props = {
  setSelected: (value: Tabs) => void
}

export const Register: FC<Props> = ({ setSelected }) => {
  const {
    handleSubmit,
    control,
    getValues,
    setError,
    formState: { errors },
  } = useForm<Register>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      name: "",
      password: "",
        repeatPassword: "",
    },
  })
  const [errorResponse, setErrorResponse] = useState<string>("")
  const [register, { isLoading }] = useRegisterMutation()

  const onSubmit = async (data: Register) => {
    if (getValues().repeatPassword !== getValues().password) {
      setError("repeatPassword", { message: "Пароли должны быть одинаковыми!" })
      return
    }
    try {
      await register(data).unwrap()
      setSelected("login")
    } catch (err) {
      console.log(err)

      if (hasErrorField(err)) {
        setErrorResponse(err.data.error)
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        control={control}
        name="name"
        label="Имя"
        type="text"
        required="Обязательное поле"
      />
      <Input
        control={control}
        name="email"
        label="Email"
        type="email"
        required="Обязательное поле"
      />
      <Input
        control={control}
        name="password"
        label="Пароль"
        type="password"
        required="Обязательное поле"
      />
      <Input
        control={control}
        name="repeatPassword"
        label="Повторите пароль"
        type="password"
        required="Обязательное поле"
      />
      <ErrorMessage error={errorResponse} />
      <p className="text-center text-small">
        Есть аккаунт?&nbsp;
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("login")}
        >
          Войти
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Зарегистрироваться
        </Button>
      </div>
    </form>
  )
}
