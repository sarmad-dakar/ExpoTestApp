import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";
import ScreenWrapper from "@/app/components/ScreenWrapper";

const TermsConditionScreen = () => {
  return (
    <View style={styles.container}>
      <GeneralHeader title="Terms & Conditions" back={true} />
      <ScreenWrapper>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ flex: 1 }}
        >
          <BerlingskeMedium style={styles.heading}>
            1. SCOPE AND DEFINITIONS
          </BerlingskeMedium>
          <Text>
            1.1 By means of MSC registered Customer can:{"\n"}
            A. View invoices and bookings issued in the past 12 months on the
            Customer’s Account/s. If the Customer wishes to keep a record of
            invoices for personal use the invoices can be saved in PDF format or
            printed (via browser).{"\n"}
            B. carry out online payments using the Customer’s authorised
            credit/debit card in return for which the Customer settles in whole
            or in part the amount due on his/her booking invoice with Malta
            Sport Club.{"\n"}
            {"\n"}
            1.2 For the scope of these terms and conditions:{"\n"}
            i. “Account” means the Customer’s account for any of The Malta Union
            Club's online booking services, including tennis, squash, etc;{"\n"}
            ii. “Customer” means the person named as Account Holder, who must
            also be the signatory to the Agreement with The Malta Union Club and
            includes any person who we reasonably believe to be acting with your
            authority, and “your” shall be construed accordingly;{"\n"}
            iii. “Invoice” means the invoice, which is calculated on the rates
            and charges of the online booking plan to which a Customer is
            subscribed by means of an agreement with Malta Sport Club;{"\n"}
            iv. “MSC” means Malta Sport Club;{"\n"}
            v. “MSCBOOKING.COM” is the web portal whereby a Customer logs in
            order to benefit from the web services made available through the
            internet systems by The Malta Union Club.{"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            2. The Malta Union Club'S RIGHTS AND OBLIGATIONS
          </BerlingskeMedium>
          <Text>
            2.1 MSC undertakes to:{"\n"}
            i. Provide the Customer with a secure system which enables the
            Customer to have his/her credit/debit card charged by amounts so
            authorised by the Customer;{"\n"}
            ii. Guarantee the security of MyMelita as far as within its control;
            {"\n"}
            iii. Take all reasonable steps and precautions to protect any
            information stored within its online systems provided at the point
            of its transmission to MSC;{"\n"}
            iv. Reserves the right to discontinue the availability of
            MSCBOOKING.COM at MSC’s discretion, in which case Customer will be
            notified accordingly in advance.{"\n"}
            v. MSC reserves the right to change the service and the applicable
            Terms & Conditions at any time, in which case Customer will be
            notified accordingly in advance.{"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            3. CUSTOMER’S RIGHTS AND OBLIGATIONS
          </BerlingskeMedium>
          <Text>
            3.1 The Customer acknowledges that by subscribing to MSC he/she/X is
            subscribing to e-billing and therefore will not be in receipt of
            invoices via normal mail. The Customer can login via MSCBOOKING.COM
            account to view the invoice, download and print it as required.
            {"\n"}
            3.2 The Customer acknowledges further that he/she shall:{"\n"}
            i. Input onto MSCBOOKING.COM any information as may be requested by
            MSC in respect of personal and/or credit/debit card details;{"\n"}
            ii. Input onto MSCBOOKING.COM only credit/debit card details which
            the Customer is legally authorised to use. In default of which,
            Customer would be deemed to be abusing of MSCBOOKING.COM and be in
            breach of these terms and conditions;{"\n"}
            iii. To honour all payments originating and incurred through his/her
            online booking of the Services;{"\n"}
            iv. Indemnify and hold harmless MSCBOOKING.COM for any losses
            suffered by MSC in the event that Customer is in material breach of
            any one or several of the terms and conditions contained herein;
            {"\n"}
            v. Not transfer any rights and/or obligations under these terms and
            conditions to any third party;{"\n"}
            vi. To notify MSC immediately in writing of any changes to
            Customer’s personal details, including email/postal address, as
            given to MUCBOOKING.COM on registering with ‘The Malta Union
            Club(MUC)’.{"\n"}
            3.3 Customer understands and accepts that he/she/X is hereby
            accepting responsibility for all transactions which originate
            through the ‘MUCBOOKING.COM’ account, and that all balances
            resulting from use of online booking’s services shall be due and
            payable by Customer to MSC.{"\n"}
            3.4 Customer understands and accepts that these terms and conditions
            must be read in conjunction with MSC’s Standard Terms and
            Conditions, any other document or policy referred to therein and any
            other terms and conditions applicable to a particular tariff.{"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            4. CONFIRMATION OF PAYMENT
          </BerlingskeMedium>
          <Text>
            4.1 Customers who settle their invoices via MSCBOOKING.COM shall
            receive an email confirming the amount paid. This email is not a
            fiscal receipt. Your next invoice is the fiscal receipt.{"\n"}
            4.2 Customers who top-up their online account via MSCBOOKING.COM
            shall receive an email confirming the amount paid. This email is a
            fiscal receipt. Customers shall not receive a hard copy receipt for
            the transaction.{"\n"}
            4.3 MSC shall not be liable for any damages if an automated email is
            not issued.{"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            5. REFUNDING YOUR MONEY
          </BerlingskeMedium>
          <Text>
            5.1 We will make all refunds to the card used for payment.
          </Text>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
};

export default TermsConditionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
  },
});
