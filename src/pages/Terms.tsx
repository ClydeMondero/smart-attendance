import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Terms and Conditions */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>By using this website, you agree to the following terms:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              You must use this site in compliance with all applicable laws.
            </li>
            <li>
              You may not use the site for any unlawful or harmful purposes.
            </li>
            <li>
              Content provided is for informational purposes only and may change
              without notice.
            </li>
            <li>
              We are not responsible for external links or third-party content.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            Your privacy is important to us. This policy outlines how we handle
            your data:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>We collect minimal data necessary to provide our services.</li>
            <li>
              Personal information is not shared with third parties without
              consent.
            </li>
            <li>Cookies may be used to enhance user experience.</li>
            <li>
              You may contact us to request access or deletion of your data.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
