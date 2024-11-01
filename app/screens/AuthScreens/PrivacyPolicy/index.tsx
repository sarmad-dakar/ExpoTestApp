import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import GeneralHeader from "@/app/components/GeneralHeader";
import ScreenWrapper from "@/app/components/ScreenWrapper";
import BerlingskeMedium from "@/app/components/TextWrapper/BerlingskeMedium";

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <GeneralHeader title="Privacy Policy" back={true} />
      <ScreenWrapper>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ flex: 1 }}
        >
          <BerlingskeMedium style={styles.heading}>
            1. INTERPRETATION
          </BerlingskeMedium>
          <BerlingskeMedium style={styles.heading2}>
            1.1 Definitions:
          </BerlingskeMedium>
          <Text>
            Automated Decision-Making (ADM): when a decision is made based
            solely on Automated Processing (including profiling) which produces
            legal effects or significantly affects an individual. The GDPR
            prohibits Automated Decision-Making (unless certain conditions are
            met) but not Automated Processing.{"\n"}
            {"\n"}
            Automated Processing: any form of automated processing of Personal
            Data consisting of the use of Personal Data to evaluate certain
            personal aspects relating to an individual, in particular to analyse
            or predict aspects concerning that individual's performance at work,
            economic situation, health, personal preferences, interests,
            reliability, behaviour, location or movements. Profiling is an
            example of Automated Processing.{"\n"}
            {"\n"}
            Club name: The Malta Union Club.{"\n"}
            {"\n"}
            Club Personnel: all employees, workers [contractors, agency workers,
            consultants,] directors, members and others.{"\n"}
            {"\n"}
            Consent: agreement which must be freely given, specific, informed
            and be an unambiguous indication of the Data Subject's wishes by
            which they, by a statement or by a clear positive action, signifies
            agreement to the Processing of Personal Data relating to them.{"\n"}
            {"\n"}
            Data Controller: the person or organisation that determines when,
            why and how to process Personal Data. It is responsible for
            establishing practices and policies in line with the GDPR. We are
            the Data Controller of all Personal Data relating to our Club
            Personnel and Personal Data used in our business for our own
            commercial purposes.
            {"\n"}
            {"\n"}
            Data Subject: a living, identified or identifiable individual about
            whom we hold Personal Data. Data Subjects may be nationals or
            residents of any country and may have legal rights regarding their
            Personal Data.{"\n"}
            {"\n"}
            Data Privacy Impact Assessment (DPIA): tools and assessments used to
            identify and reduce risks of a data processing activity. DPIA can be
            carried out as part of Privacy by Design and should be conducted for
            all major system or business change programs involving the
            Processing of Personal Data.{"\n"}
            {"\n"}
            Data Protection Officer (DPO): the person required to be appointed
            in specific circumstances under the GDPR. Where a mandatory DPO has
            not been appointed, this term means a data protection manager or
            other voluntary appointment of a DPO or refers to the club data
            privacy team with responsibility for data protection compliance.
            {"\n"}
            {"\n"}
            EEA: the 28 countries in the EU, and Iceland, Liechtenstein and
            Norway.{"\n"}
            {"\n"}
            Explicit Consent: consent which requires a very clear and specific
            statement (that is, not just action).{"\n"}
            {"\n"}
            General Data Protection Regulation (GDPR): the General Data
            Protection Regulation ((EU) 2016/679). Personal Data is subject to
            the legal safeguards specified in the GDPR.{"\n"}
            {"\n"}
            Personal Data: any information identifying a Data Subject or
            information relating to a Data Subject that we can identify
            (directly or indirectly) from that data alone or in combination with
            other identifiers we possess or can reasonably access. Personal Data
            includes Sensitive Personal Data and Pseudonymised Personal Data but
            excludes anonymous data or data that has had the identity of an
            individual permanently removed. Personal data can be factual (for
            example, a name, email address, location or date of birth) or an
            opinion about that person's actions or behaviour. [Personal Data
            specifically includes, but is not limited to, [INSERT PERSONAL DATA
            CATEGORY LIST IF NECESSARY].{"\n"}
            {"\n"}
            Personal Data Breach: any act or omission that compromises the
            security, confidentiality, integrity or availability of Personal
            Data or the physical, technical, administrative or organisational
            safeguards that we or our third-party service providers put in place
            to protect it. The loss, or unauthorised access, disclosure or
            acquisition, of Personal Data is a Personal Data Breach.{"\n"}
            {"\n"}
            Privacy by Design: implementing appropriate technical and
            organisational measures in an effective manner to ensure compliance
            with the GDPR.{"\n"}
            {"\n"}
            Privacy Notices (also referred to as Fair Processing Notices) or
            Privacy Policies: separate notices setting out information that may
            be provided to Data Subjects when the Club collects information
            about them. These notices may take the form of general privacy
            statements applicable to a specific group of individuals (for
            example, employee privacy notices or the website privacy policy) or
            they may be stand-alone, one-time privacy statements covering
            Processing related to a specific purpose.{"\n"}
            {"\n"}
            Processing or Process: any activity that involves the use of
            Personal Data. It includes obtaining, recording or holding the data,
            or carrying out any operation or set of operations on the data
            including organising, amending, retrieving, using, disclosing,
            erasing or destroying it. Processing also includes transmitting or
            transferring Personal Data to third parties.{"\n"}
            {"\n"}
            Pseudonymisation or Pseudonymised: replacing information that
            directly or indirectly identifies an individual with one or more
            artificial identifiers or pseudonyms so that the person, to whom the
            data relates, cannot be identified without the use of additional
            information which is meant to be kept separately and secure.{"\n"}
            {"\n"}
            Related Policies: the Club's policies, operating procedures or
            processes related to this Privacy Standard and designed to protect
            Personal Data.{"\n"}
            {"\n"}
            Sensitive Personal Data: information revealing racial or ethnic
            origin, political opinions, religious or similar beliefs, trade
            union membership, physical or mental health conditions, sexual life,
            sexual orientation, biometric or genetic data, and Personal Data
            relating to criminal offences and convictions.{"\n"}
            {"\n"}
          </Text>
          <BerlingskeMedium style={styles.heading}>
            INTRODUCTION
          </BerlingskeMedium>
          <Text>
            This Privacy Standard sets out how The Malta Union Club ('we',
            'our', 'us', 'the Club') handle the Personal Data of our customers,
            suppliers, employees, workers and other third parties.{"\n"}
            {"\n"}
            This Privacy Standard applies to all Personal Data we Process
            regardless of the media on which that data is stored or whether it
            relates to past or present employees, workers, customers, clients or
            supplier contacts, shareholders, website users or any other Data
            Subject.{"\n"}
            {"\n"}
            This Privacy Standard applies to all Club Personnel ('you', 'your').
            You must read, understand and comply with this Privacy Standard when
            Processing Personal Data on our behalf and attend training on its
            requirements. This Privacy Standard sets out what we expect from you
            in order for the Club to comply with applicable law. Your compliance
            with this Privacy Standard is mandatory. Related Policies and
            Privacy Guidelines are available to help you interpret and act in
            accordance with this Privacy Standard. You must also comply with all
            such Related Policies and Privacy Guidelines. Any breach of this
            Privacy Standard may result in disciplinary action.{"\n"}
            {"\n"}
            This Privacy Standard (together with Related Policies and Privacy
            Guidelines) is an internal document and cannot be shared with third
            parties, clients or regulators without prior authorisation from the
            DPO.
          </Text>
          <BerlingskeMedium style={styles.heading}>SCOPE</BerlingskeMedium>
          <Text>
            We recognise that the correct and lawful treatment of Personal Data
            will maintain confidence in the organisation and will provide for
            successful business operations. Protecting the confidentiality and
            integrity of Personal Data is a critical responsibility that we take
            seriously at all times. The Club is exposed to potential fines of up
            to EUR20 million (approximately £18 million) or 4% of total
            worldwide annual turnover, whichever is higher and depending on the
            breach, for failure to comply with the provisions of the GDPR.{"\n"}
            {"\n"}
            The Management are responsible for ensuring all Club Personnel
            comply with this Privacy Standard and need to implement appropriate
            practices, processes, controls and training to ensure such
            compliance.{"\n"}
            {"\n"}
            The DPO is responsible for overseeing this Privacy Standard and, as
            applicable, developing Related Policies and Privacy Guidelines. This
            post is held by Dr Clinton Calleja on __________________
            {"\n"}
            {"\n"}
            Please contact the DPO with any questions about the operation of
            this Privacy Standard or the GDPR or if you have any concerns that
            this Privacy Standard is not being or has not been followed. In
            particular, you must always contact the DPO in the following
            circumstances:{"\n"}
            {"\n"}
            a) if you are unsure of the lawful basis which you are relying on to
            process Personal Data (including the legitimate interests used by
            the Club) (see paragraph ‎5.1 below);{"\n"}
            {"\n"}
            b) if you need to rely on Consent and/or need to capture Explicit
            Consent (see paragraph ‎5.2 below);{"\n"}
            {"\n"}
            c) if you need to draft Privacy Notices or Fair Processing Notices
            (see paragraph ‎5.3 below);{"\n"}
            {"\n"}
            d) if you are unsure about the retention period for the Personal
            Data being Processed (see paragraph ‎7 below);{"\n"}
            {"\n"}
            e) if you are unsure about what security or other measures you need
            to implement to protect Personal Data (see paragraph ‎10.1 below);
            {"\n"}
            {"\n"}
            f) if there has been a Personal Data Breach (paragraph ‎10.2 below);
            {"\n"}
            {"\n"}
            g) if you are unsure on what basis to transfer Personal Data outside
            the EEA (see paragraph ‎11 below);{"\n"}
            {"\n"}
            h) if you need any assistance dealing with any rights invoked by a
            Data Subject (see paragraph ‎12);{"\n"}
            {"\n"}
            i) whenever you are engaging in a significant new, or change in,
            Processing activity which is likely to require a DPIA (see paragraph
            ‎13.4 below) or plan to use Personal Data for purposes others than
            what it was collected for;{"\n"}
            {"\n"}
            j) If you plan to undertake any activities involving Automated
            Processing including profiling or Automated Decision-Making (see
            paragraph ‎13.5 below);{"\n"}
            {"\n"}
            k) If you need help complying with applicable law when carrying out
            direct marketing activities (see paragraph ‎13.6 below); or
            {"\n"}
            {"\n"}
            l) if you need help with any contracts or other areas in relation to
            sharing Personal Data with third parties (including our vendors)
            (see paragraph ‎13.7 below).{"\n"}
            {"\n"}
          </Text>
          <BerlingskeMedium style={styles.heading}>
            PERSONAL DATA PROTECTION PRINCIPLES
          </BerlingskeMedium>
          <Text>
            We adhere to the principles relating to Processing of Personal Data
            set out in the GDPR which require Personal Data to be:{"\n"}
            {"\n"}
            a) Processed lawfully, fairly and in a transparent manner
            (Lawfulness, Fairness and Transparency).{"\n"}
            {"\n"}
            b) Collected only for specified, explicit and legitimate purposes
            (Purpose Limitation).{"\n"}
            {"\n"}
            c) Adequate, relevant and limited to what is necessary in relation
            to the purposes for which it is Processed (Data Minimisation).{"\n"}
            {"\n"}
            d) Accurate and where necessary kept up to date (Accuracy).{"\n"}
            {"\n"}
            e) Not kept in a form which permits identification of Data Subjects
            for longer than is necessary for the purposes for which the data is
            Processed (Storage Limitation).{"\n"}
            {"\n"}
            f) Processed in a manner that ensures its security using appropriate
            technical and organisational measures to protect against
            unauthorised or unlawful Processing and against accidental loss,
            destruction or damage (Security, Integrity and Confidentiality).
            {"\n"}
            {"\n"}
            g) Not transferred to another country without appropriate safeguards
            being in place (Transfer Limitation).{"\n"}
            {"\n"}
            h) Made available to Data Subjects and Data Subjects allowed to
            exercise certain rights in relation to their Personal Data (Data
            Subject's Rights and Requests).{"\n"}
            {"\n"}
            We are responsible for and must be able to demonstrate compliance
            with the data protection principles listed above (Accountability).
          </Text>
          <BerlingskeMedium style={styles.heading}>
            LAWFULNESS, FAIRNESS, TRANSPARENCY
          </BerlingskeMedium>
          <Text>
            5.1 Lawfulness and fairness{"\n"}
            {"\n"}
            Personal data must be Processed lawfully, fairly and in a
            transparent manner in relation to the Data Subject.{"\n"}
            {"\n"}
            You may only collect, Process and share Personal Data fairly and
            lawfully and for specified purposes. The GDPR restricts our actions
            regarding Personal Data to specified lawful purposes. These
            restrictions are not intended to prevent Processing, but ensure that
            we Process Personal Data fairly and without adversely affecting the
            Data Subject.{"\n"}
            {"\n"}
            The GDPR allows Processing for specific purposes, some of which are
            set out below:{"\n"}
            {"\n"}
            a) the Data Subject has given his or her Consent;{"\n"}
            {"\n"}
            b) the Processing is necessary for the performance of a contract
            with the Data Subject;{"\n"}
            {"\n"}
            c) to meet our legal compliance obligations;{"\n"}
            {"\n"}
            d) to protect the Data Subject's vital interests;{"\n"}
            {"\n"}
            e) to pursue our legitimate interests for purposes where they are
            not overridden because the Processing prejudices the interests or
            fundamental rights and freedoms of Data Subjects. The purposes for
            which we process Personal Data for legitimate interests need to be
            set out in applicable Privacy Notices or Fair Processing Notices; or
            {"\n"}
            {"\n"}
            f) In accordance with the Companies Act article 163 (5) the
            accounting records are to be maintained for a period of 10 years. In
            the cases where such information is maintained in a bound form, the
            ten years shall commence from the date of the last entry; and{"\n"}
            {"\n"}
            g) In accordance with the Income Tax Management Act article 19 (5)
            for not less than nine years from the end of the year to which the
            accounting records relate; and{"\n"}
            {"\n"}
            h) In accordance with the Value Added Tax Act article 48 the records
            for at least six years from the end of the year to which they
            relate; and{"\n"}
            {"\n"}
            i) In accordance with the Employment and Training Services Act
            article 36 (2) for a period of three years subsequent to the date of
            the record; and{"\n"}
            {"\n"}
            j) In accordance with the Occupational Health and Safety Authority
            Act, the employer is bound to maintain a safe environment. In order
            to achieve this the employer is to have certain data and procedures;
            {"\n"}
            {"\n"}
            k) In accordance with the Social Security Act, the employer is bound
            to pay social security contributions to the authority and the
            authority may take action against the employer if he failed to pay
            such contributions. Nevertheless, the employee would not receive an
            adequate pension if it is not shown that the contributions have not
            been deducted. Given that similar issues arise when one claims a
            retirement pension it is considered opportune to maintain such data
            as long as possible for the benefit of the employee and also so that
            the employer may clearly demonstrate that he maintained his
            obligations.{"\n"}
            {"\n"}
          </Text>
          <BerlingskeMedium style={styles.heading}>CONSENT</BerlingskeMedium>
          <Text>
            5.2 Consent{"\n"}
            {"\n"}A Data Controller must only process Personal Data on the basis
            of one or more of the lawful bases set out in the GDPR, which
            include Consent.{"\n"}
            {"\n"}A Data Subject consents to Processing of their Personal Data
            if they indicate agreement clearly either by a statement or positive
            action to the Processing. Consent requires affirmative action so
            silence, pre-ticked boxes or inactivity are unlikely to be
            sufficient. If Consent is given in a document which deals with other
            matters, then the Consent must be kept separate from those other
            matters.{"\n"}
            {"\n"}
            Data Subjects must be easily able to withdraw Consent to Processing
            at any time and withdrawal must be promptly honoured. Consent may
            need to be refreshed if you intend to Process Personal Data for a
            different and incompatible purpose which was not disclosed when the
            Data Subject first consented.{"\n"}
            {"\n"}
            Unless we can rely on another legal basis of Processing, Explicit
            Consent is usually required for Processing Sensitive Personal Data,
            for Automated Decision-Making and for cross border data transfers.
            Usually we will be relying on another legal basis (and not require
            Explicit Consent) to Process most types of Sensitive Data. Where
            Explicit Consent is required, you must issue a Fair Processing
            Notice to the Data Subject to capture Explicit Consent.{"\n"}
            {"\n"}
            You will need to evidence Consent captured and keep records of all
            Consents so that the Club can demonstrate compliance with Consent
            requirements.{"\n"}
            {"\n"}
          </Text>
          <BerlingskeMedium style={styles.heading}>CONSENT</BerlingskeMedium>
          <Text>
            5.2 Consent{"\n"}
            {"\n"}A Data Controller must only process Personal Data on the basis
            of one or more of the lawful bases set out in the GDPR, which
            include Consent.{"\n"}
            {"\n"}A Data Subject consents to Processing of their Personal Data
            if they indicate agreement clearly either by a statement or positive
            action to the Processing. Consent requires affirmative action so
            silence, pre-ticked boxes or inactivity are unlikely to be
            sufficient. If Consent is given in a document which deals with other
            matters, then the Consent must be kept separate from those other
            matters.{"\n"}
            {"\n"}
            Data Subjects must be easily able to withdraw Consent to Processing
            at any time and withdrawal must be promptly honoured. Consent may
            need to be refreshed if you intend to Process Personal Data for a
            different and incompatible purpose which was not disclosed when the
            Data Subject first consented.{"\n"}
            {"\n"}
            Unless we can rely on another legal basis of Processing, Explicit
            Consent is usually required for Processing Sensitive Personal Data,
            for Automated Decision-Making and for cross border data transfers.
            Usually we will be relying on another legal basis (and not require
            Explicit Consent) to Process most types of Sensitive Data. Where
            Explicit Consent is required, you must issue a Fair Processing
            Notice to the Data Subject to capture Explicit Consent.{"\n"}
            {"\n"}
            You will need to evidence Consent captured and keep records of all
            Consents so that the Club can demonstrate compliance with Consent
            requirements.{"\n"}
            {"\n"}
          </Text>
          <BerlingskeMedium style={styles.heading}>
            PURPOSE LIMITATION
          </BerlingskeMedium>
          <Text>
            PURPOSE LIMITATION{"\n"}
            {"\n"}
            Personal Data must be collected only for specified, explicit and
            legitimate purposes. It must not be further Processed in any manner
            incompatible with those purposes.{"\n"}
            {"\n"}
            You cannot use Personal Data for new, different or incompatible
            purposes from that disclosed when it was first obtained unless you
            have informed the Data Subject of the new purposes and they have
            consented where necessary.{"\n"}
            {"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            DATA MINIMISATION
          </BerlingskeMedium>
          <Text>
            DATA MINIMISATION{"\n"}
            {"\n"}
            Personal Data must be adequate, relevant and limited to what is
            necessary in relation to the purposes for which it is Processed.
            {"\n"}
            {"\n"}
            You may only Process Personal Data when performing your job duties
            requires it. You cannot Process Personal Data for any reason
            unrelated to your job duties.{"\n"}
            {"\n"}
            You may only collect Personal Data that you require for your job
            duties: do not collect excessive data. Ensure any Personal Data
            collected is adequate and relevant for the intended purposes.{"\n"}
            {"\n"}
            You must ensure that when Personal Data is no longer needed for
            specified purposes, it is deleted or anonymised in accordance with
            the Club's data retention guidelines.{"\n"}
            {"\n"}
          </Text>
          <BerlingskeMedium style={styles.heading}>ACCURACY</BerlingskeMedium>
          <Text>
            ACCURACY{"\n"}
            {"\n"}
            Personal Data must be accurate and, where necessary, kept up to
            date. It must be corrected or deleted without delay when inaccurate.
            {"\n"}
            {"\n"}
            You will ensure that the Personal Data we use and hold is accurate,
            complete, kept up to date and relevant to the purpose for which we
            collected it. You must check the accuracy of any Personal Data at
            the point of collection and at regular intervals afterwards. You
            must take all reasonable steps to destroy or amend inaccurate or
            out-of-date Personal Data.{"\n"}
            {"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            STORAGE LIMITATION
          </BerlingskeMedium>
          <Text>
            STORAGE LIMITATION{"\n"}
            {"\n"}
            Personal Data must not be kept in an identifiable form for longer
            than is necessary for the purposes for which the data is processed.
            {"\n"}
            {"\n"}
            You must not keep Personal Data in a form which permits the
            identification of the Data Subject for longer than needed for the
            legitimate business purpose or purposes for which we originally
            collected it including for the purpose of satisfying any legal,
            accounting or reporting requirements.{"\n"}
            {"\n"}
            The Club will maintain retention policies and procedures to ensure
            Personal Data is deleted after a reasonable time for the purposes
            for which it was being held, unless a law requires such data to be
            kept for a minimum time. You must comply with the Club's guidelines
            on Data Retention. The Club currently maintains its records for a
            period of 10 years in general but for longer periods in
            circumstances related to Tax, Anti Money Laundering, court cases and
            data regarding social security contributions.{"\n"}
            {"\n"}
            You will take all reasonable steps to destroy or erase from our
            systems all Personal Data that we no longer require in accordance
            with all the Club's applicable records retention schedules and
            policies. This includes requiring third parties to delete such data
            where applicable.{"\n"}
            {"\n"}
            You will ensure Data Subjects are informed of the period for which
            data is stored and how that period is determined in any applicable
            Privacy Notice or Fair Processing Notice.{"\n"}
            {"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            SECURITY INTEGRITY AND CONFIDENTIALITY
          </BerlingskeMedium>
          <Text>
            SECURITY INTEGRITY AND CONFIDENTIALITY{"\n"}
            {"\n"}
            10.1 Protecting Personal Data{"\n"}
            {"\n"}
            Personal Data must be secured by appropriate technical and
            organisational measures against unauthorised or unlawful Processing,
            and against accidental loss, destruction or damage.{"\n"}
            {"\n"}
            We will develop, implement and maintain safeguards appropriate to
            our size, scope and business, our available resources, the amount of
            Personal Data that we own or maintain on behalf of others and
            identified risks (including use of encryption and Pseudonymisation
            where applicable). We will regularly evaluate and test the
            effectiveness of those safeguards to ensure security of our
            Processing of Personal Data. You are responsible for protecting the
            Personal Data we hold. You must implement reasonable and appropriate
            security measures against unlawful or unauthorised Processing of
            Personal Data and against the accidental loss of, or damage to,
            Personal Data. You must exercise particular care in protecting
            Sensitive Personal Data from loss and unauthorised access, use or
            disclosure.{"\n"}
            {"\n"}
            You must follow all procedures and technologies we put in place to
            maintain the security of all Personal Data from the point of
            collection to the point of destruction. You may only transfer
            Personal Data to third-party service providers who agree to comply
            with the required policies and procedures and who agree to put
            adequate measures in place, as requested.{"\n"}
            {"\n"}
            You must maintain data security by protecting the confidentiality,
            integrity and availability of the Personal Data, defined as follows:
            {"\n"}
            {"\n"}
            a) Confidentiality means that only people who have a need to know
            and are authorised to use the Personal Data can access it.{"\n"}
            b) Integrity means that Personal Data is accurate and suitable for
            the purpose for which it is processed.{"\n"}
            c) Availability means that authorised users are able to access the
            Personal Data when they need it for authorised purposes.{"\n"}
            {"\n"}
            You must comply with and not attempt to circumvent the
            administrative, physical and technical safeguards we implement and
            maintain in accordance with the GDPR and relevant standards to
            protect Personal Data.{"\n"}
            {"\n"}
            10.2 Reporting a Personal Data Breach{"\n"}
            {"\n"}
            The GDPR requires Data Controllers to notify any Personal Data
            Breach to the applicable regulator and, in certain instances, the
            Data Subject.{"\n"}
            {"\n"}
            We have put in place procedures to deal with any suspected Personal
            Data Breach and will notify Data Subjects or any applicable
            regulator where we are legally required to do so.{"\n"}
            {"\n"}
            If you know or suspect that a Personal Data Breach has occurred, do
            not attempt to investigate the matter yourself. Immediately contact
            the person or team designated as the key point of contact for
            Personal Data Breaches. You should preserve all evidence relating to
            the potential Personal Data Breach.{"\n"}
            {"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            TRANSFER LIMITATION
          </BerlingskeMedium>
          <Text>
            TRANSFER LIMITATION{"\n"}
            {"\n"}
            The GDPR restricts data transfers to countries outside the EEA in
            order to ensure that the level of data protection afforded to
            individuals by the GDPR is not undermined. You transfer Personal
            Data originating in one country across borders when you transmit,
            send, view or access that data in or to a different country.{"\n"}
            {"\n"}
            You may only transfer Personal Data outside the EEA if one of the
            following conditions applies:{"\n"}
            a) the European Commission has issued a decision confirming that the
            country to which we transfer the Personal Data ensures an adequate
            level of protection for the Data Subjects' rights and freedoms;
            {"\n"} {"\n"}
            b) appropriate safeguards are in place such as binding corporate
            rules (BCR), standard contractual clauses approved by the European
            Commission, an approved code of conduct or a certification
            mechanism, a copy of which can be obtained from the DPO;{"\n"}{" "}
            {"\n"}
            c) the Data Subject has provided Explicit Consent to the proposed
            transfer after being informed of any potential risks; or{"\n"}{" "}
            {"\n"}
            d) the transfer is necessary for one of the other reasons set out in
            the GDPR including the performance of a contract between us and the
            Data Subject, reasons of public interest, to establish, exercise or
            defend legal claims or to protect the vital interests of the Data
            Subject where the Data Subject is physically or legally incapable of
            giving Consent and, in some limited cases, for our legitimate
            interest.{"\n"}
            {"\n"}
          </Text>

          <BerlingskeMedium style={styles.heading}>
            DATA SUBJECT'S RIGHTS AND REQUESTS
          </BerlingskeMedium>
          <Text>
            DATA SUBJECT'S RIGHTS AND REQUESTS{"\n"}
            {"\n"}
            Data Subjects have rights when it comes to how we handle their
            Personal Data. These include rights to:{"\n"}
            {"\n"}
            a) withdraw Consent to Processing at any time;{"\n"}
            {"\n"}
            b) receive certain information about the Data Controller's
            Processing activities;{"\n"}
            {"\n"}
            c) request access to their Personal Data that we hold;{"\n"}
            {"\n"}
            d) prevent our use of their Personal Data for direct marketing
            purposes;{"\n"}
            {"\n"}
            e) ask us to erase Personal Data if it is no longer necessary in
            relation to the purposes for which it was collected or Processed or
            to rectify inaccurate data or to complete incomplete data;{"\n"}
            {"\n"}
            f) restrict Processing in specific circumstances;{"\n"}
            {"\n"}
            g) challenge Processing which has been justified on the basis of our
            legitimate interests or in the public interest;{"\n"}
            {"\n"}
            h) request a copy of an agreement under which Personal Data is
            transferred outside of the EEA;{"\n"}
            {"\n"}
            i) object to decisions based solely on Automated Processing,
            including profiling (ADM);{"\n"}
            {"\n"}
            j) prevent Processing that is likely to cause damage or distress to
            the Data Subject or anyone else;{"\n"}
            {"\n"}
            k) be notified of a Personal Data Breach which is likely to result
            in high risk to their rights and freedoms;{"\n"}
            {"\n"}
            l) make a complaint to the supervisory authority; and{"\n"}
            {"\n"}
            m) in limited circumstances, receive or ask for their Personal Data
            to be transferred to a third party in a structured, commonly used
            and machine-readable format.{"\n"}
            {"\n"}
            You must verify the identity of an individual requesting data under
            any of the rights listed above (do not allow third parties to
            persuade you into disclosing Personal Data without proper
            authorisation).{"\n"}
            {"\n"}
            You must immediately forward any Data Subject request you receive to
            your supervisor or immediate superior.{"\n"}
            {"\n"}
          </Text>
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 20,
    marginBottom: 5,
  },
  heading2: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
});
