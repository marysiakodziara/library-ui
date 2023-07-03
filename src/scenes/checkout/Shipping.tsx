/*import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import AddressForm from "./AddressForm";
import {initialValuesType} from "./Checkout";

export interface ShippingProps {
    values: initialValuesType;
    errors: any;
    touched: any;
    handleBlur: any;
    handleChange: any;
    setFieldValue: any;
}

const Shipping = ({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                      setFieldValue
                  }: ShippingProps) => {
    return (
        <Box m="30px auto">
            <Box>
                <Typography sx={{ mb: "15px"}} fontSize="18px">
                    Billing Information
                </Typography>
                <AddressForm
                    type="billingAddress"
                    values={values.billingAddress}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            </Box>
            <Box mb="20px">
                <FormControlLabel
                    label="Same for Shipping Address"
                    control={
                    <Checkbox
                        defaultChecked
                        value={values.shippingAddress.isSameAddress}
                        onChange={() => setFieldValue(
                            "shippingAddress.isSameAddress",
                            !values.shippingAddress.isSameAddress
                        )}
                    />
                    }
                />
            </Box>
            {!values.shippingAddress.isSameAddress && (
                <Box>
                    <Typography sx={{ mb: "15px"}} fontSize="18px">
                        Shipping Information
                    </Typography>
                    <AddressForm
                        type="shippingAddress"
                        values={values.shippingAddress}
                        errors={errors}
                        touched={touched}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                    />
                </Box>
                )}
        </Box>
    )
}*/

const Shipping = () => {
    return (
        <div>Shipping</div>
    );
}

export default Shipping;