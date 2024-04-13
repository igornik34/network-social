import React, { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "../../components/input/input"
import { Button, Link } from "@nextui-org/react"
import { Tabs } from "../../pages/auth"
import {
  useLazyCurrentQuery,
  useLoginMutation,
} from "../../app/services/userApi"
import { useNavigate } from "react-router-dom"
import { hasErrorField } from "../../utils/has-error-field"
import { ErrorMessage } from "../../components/error-message"

type Login = {
  email: string
  password: string
}

type Props = {
  setSelected: (value: Tabs) => void
}

export const Login: FC<Props> = ({ setSelected }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Login>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const [errorResponse, setErrorResponse] = useState<string>("")
  const [triggerCurrentQuery] = useLazyCurrentQuery()

  const onSubmit = async (data: Login) => {
    try {
      await login(data).unwrap()
      await triggerCurrentQuery().unwrap()
      navigate("/")
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
      <ErrorMessage error={errorResponse} />
      <p className="text-center text-small">
        Нет аккаунта?&nbsp;
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("register")}
        >
          Зарегистрируйтесь
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Войти
        </Button>
      </div>
    </form>
  )
}
