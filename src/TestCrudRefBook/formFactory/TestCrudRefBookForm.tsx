import { Form, Field, FormRenderProps } from "react-final-form";
import { Button, FormControl, Stack, TextField } from '@mui/material';

export type DhlTypeFormProps = FormRenderProps & {
  disabled?: boolean;
  onClose?: () => void;
  isUpdate?: boolean;
  isCreate?: boolean;
}

function FormFieldWrapper(Component: any) {
  const componentdWrapped = ({ onChange, input, meta, ...rest }: any) => {
    const customOnChange = (e: any) => {
      if (onChange) {
        onChange?.(e);
      } else {
        input.onChange(e);
      }
    }
    return (
      <FormControl>
        <Component
          {...input}
          {...rest}
          onChange={customOnChange}
        // isInvalid={meta.touched && meta.invalid}
        />
        {meta.touched && (meta.error || meta.submitError)}
      </FormControl>
    )
  }
  return componentdWrapped
}

const TextFieldWrapped = FormFieldWrapper(TextField)

function DhlTypeRefBookForm(props: DhlTypeFormProps) {
  const { submitting, disabled, handleSubmit, onClose, isCreate, isUpdate } = props;

  return <form onSubmit={handleSubmit} className="create-passcard-form">
    {isCreate && <div>Создание</div>}
    {isUpdate && <div>Редактирование</div>}
    <Stack sx={{ marginTop: 1 }} spacing={1.5}>
      <Field
        label="name"
        name="name"
        component={TextFieldWrapped}
        disabled={disabled || submitting}
      />
      <Button type="submit" variant="contained" disabled={disabled || submitting}>Создать</Button>
      <Button
        color="secondary"
        variant="contained"
        onClick={onClose}
        disabled={disabled || submitting}
      >
        Отмена
      </Button>
    </Stack>
  </form >
}

const DefaultDhlTypeRefBookForm = (props: any) => <Form {...props} render={DhlTypeRefBookForm} />

export default DefaultDhlTypeRefBookForm;