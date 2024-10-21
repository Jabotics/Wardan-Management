import { useState } from 'react'
import { Data } from './schema'
import TableToolbarActions from '@/components/table/table-toolbar-actions'
import { useRemoveAssetMutation } from '@/store/actions/slices/assetsSlice'
import FormComponent from './@modify-data/form-component'

export const ItemName = ({ data }: { data: Data }) => {
  return <>{data?.item_name}</>
}

export const Amount = ({ data }: { data: Data }) => {
  return <>{`₹ ${data?.amount}`}</>
}

export const Invoice = ({ data }: { data: Data }) => {
  return <>{data?.invoice_no}</>
}

export const ToolbarAction = ({ data }: { data: Data }) => {

  const [Delete] = useRemoveAssetMutation()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [deleteText, setDeleteText] = useState<string>('')

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleDelete() {
    if (data && data._id) {
      setIsSubmitting(true)
      try {
        const res = await Delete({ id: data._id }).unwrap()

        if (res.status === 'fail') throw new Error(res.message)

        setDeleteOpen(false)
      } catch (error) {
        console.log(error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className='flex items-center justify-center gap-2'>
      <TableToolbarActions
        open={editOpen}
        setOpen={setEditOpen}
        label='Edit'
        text={deleteText}
        setText={setDeleteText}
      >
        <FormComponent
          data={data}
          setOpen={setEditOpen}
          toEdit={true}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </TableToolbarActions>

      <TableToolbarActions
        text={deleteText}
        setText={setDeleteText}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        label='Delete'
        handleDelete={handleDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

