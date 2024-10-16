import {
  useGetPurchaseEntryItemsQuery,
  useRemovePurchaseItemMutation,
} from '@/store/actions/slices/purchaseSlice'
import { useEffect, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import ModifyPurchaseItems from './modify-purchase-item'

const mapToCategory = {
  RAW_MATERIAL: 'Raw Material',
  PACKAGING_PRODUCT: 'Packaging Product',
  OTHER: 'Other',
}

const PurchaseItems = ({
  purchaseId,
  setClose,
  category,
}: {
  purchaseId: string
  setClose: React.Dispatch<React.SetStateAction<boolean>>
  category: 'RAW_MATERIAL' | 'PACKAGING_PRODUCT' | 'OTHER'
}) => {
  const [Delete] = useRemovePurchaseItemMutation()
  const { data, isLoading, isError } = useGetPurchaseEntryItemsQuery(
    { id: purchaseId },
    { skip: !purchaseId }
  )
  const allItemsPurchased = data?.data || []
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const handleDeleteSellItems = async (toDeleteItemId: string) => {
    try {
      if (toDeleteItemId) {
        await Delete({ id: toDeleteItemId })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isError) {
      const handleError = setTimeout(() => {
        setClose(false)
      }, 1000)

      return () => clearTimeout(handleError)
    }
  }, [isError, setClose])

  if (isLoading) {
    return <>Loading....</>
  }
  if (isError) {
    return <>Error in fetching</>
  }

  return (
    <div className='flex w-full flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden'>
      <div
        onClick={() => setClose(false)}
        className='absolute right-5 top-5 cursor-pointer'
      >
        <Cross2Icon className='h-4 w-4' />
      </div>
      {allItemsPurchased?.length > 0
        ? allItemsPurchased.map((item, index) => {
            return (
              <div
                className='flex h-24 w-full flex-col bg-black/10'
                key={index}
              >
                <div className='flex w-full flex-1 items-center justify-between px-3 py-2'>
                  <div className='flex h-full w-full flex-col items-start justify-start'>
                    <div className='text-lg'>
                      {item.material?.name ?? item?.product?.name + ' Powder'}
                    </div>
                    <div className='text-sm text-gray-800/75'>
                      {mapToCategory[item?.category]}
                    </div>
                  </div>
                  <div className='whitespace-nowrap'>
                    {`${item?.qty} ${item?.unit}`} ({' '}
                    <span className='stacked-fractions'>
                      ₹{item?.price_per_kg}/kg
                    </span>{' '}
                    )
                  </div>
                </div>
                <div className='flex h-10 w-full items-center justify-between border-t-2 border-dashed border-white px-3'>
                  <div className='font-mono'>{`₹ ${item?.amount}`}</div>
                  <div className='flex h-full w-1/4 items-center justify-end gap-3 text-xs'>
                    <Drawer open={editingItemId === item._id}>
                      <DrawerTrigger asChild>
                        <div
                          className='cursor-pointer underline hover:text-gray-600'
                          onClick={() => setEditingItemId(item._id)}
                        >
                          Edit
                        </div>
                      </DrawerTrigger>

                      <DrawerContent className='absolute h-[50%] w-full bg-white'>
                        <ModifyPurchaseItems
                          setOpen={() => setEditingItemId(null)}
                          data={item}
                          category={category}
                        />
                      </DrawerContent>
                    </Drawer>
                    <div
                      className='cursor-pointer underline hover:text-rose-900'
                      onClick={() => {
                        handleDeleteSellItems(item._id)
                      }}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        : null}
    </div>
  )
}

export default PurchaseItems
